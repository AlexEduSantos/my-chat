"use client";

import { createClient } from "@/app/_lib/client";
import { useCallback, useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";

interface UseRealtimeChatProps {
  roomId: string | null; // id da sala (UUID)
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  created_at: string;
  updated_at?: string;
}

const EVENT_MESSAGE_TYPE = "message";
const EVENT_UPDATE_TYPE = "message:update";
const EVENT_DELETE_TYPE = "message:delete";

export function useRealtimeChat({ roomId, username }: UseRealtimeChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
  }, [roomId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!roomId) return;
      setIsLoading(true);
      try {
        const { data: msgs, error } = await supabase
          .from("messages")
          .select("id, content, user, created_at")
          .eq("room_id", roomId)
          .order("created_at", { ascending: true })
          .limit(100);

        if (error || !msgs) {
          console.error("Error fetching messages", error);
          return;
        }

        if (cancelled) return;
        const normalized: ChatMessage[] = (msgs as any[]).map((m) => ({
          id: m.id,
          content: m.content,
          user: { name: m.user?.name ?? "Unknown" },
          created_at: m.created_at,
        }));

        setMessages((current) => {
          const existingIds = new Set(current.map((mm) => mm.id));
          const toAdd = normalized.filter((n) => !existingIds.has(n.id));
          if (toAdd.length === 0) return current;
          return [...current, ...toAdd];
        });
      } catch (err) {
        console.error("Error fetching initial messages", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomId, supabase]);

  useEffect(() => {
    if (!roomId) return;

    const newChannel = supabase.channel(roomId);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload: any) => {
        try {
          const incoming: ChatMessage = payload.payload as ChatMessage;
          if (!incoming || !incoming.id) return;

          setMessages((current) => {
            // Avoid duplicates just in case
            if (current.find((m) => m.id === incoming.id)) return current;
            return [...current, incoming];
          });
        } catch (err) {
          // fail silently; optionally log
          console.error("Error handling incoming message payload", err);
        }
      })
      .on("broadcast", { event: EVENT_UPDATE_TYPE }, (payload: any) => {
        try {
          const incoming: Partial<ChatMessage> & { id: string } =
            payload.payload as any;
          if (!incoming || !incoming.id) return;

          setMessages((current) =>
            current.map((m) => (m.id === incoming.id ? { ...m, ...incoming } : m))
          );
        } catch (err) {
          console.error("Error handling incoming update payload", err);
        }
      })
      .on("broadcast", { event: EVENT_DELETE_TYPE }, (payload: any) => {
        try {
          const incoming: { id: string } = payload.payload as any;
          if (!incoming || !incoming.id) return;

          setMessages((current) => current.filter((m) => m.id !== incoming.id));
        } catch (err) {
          console.error("Error handling incoming delete payload", err);
        }
      })
      .subscribe((status: any) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else if (
          status === "CLOSED" ||
          status === "TIMED_OUT" ||
          status === "ERROR"
        ) {
          setIsConnected(false);
        } else {
          // handle other states if needed
        }
      });

    channelRef.current = newChannel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, supabase]);

  // Trecho relevante do hook: função sendMessage que persiste no banco
  const sendMessage = useCallback(
    async (content: string) => {
      const channel = channelRef.current;
      if (!channel || !isConnected || !roomId) return;

      const messageId = uuid();
      const message: ChatMessage = {
        id: messageId,
        content,
        user: { name: username },
        created_at: new Date().toISOString(),
      };

      // Optimistic UI: adiciona localmente
      setMessages((current) => {
        if (current.find((m) => m.id === messageId)) return current;
        return [...current, message];
      });

      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });

      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (userError || !user) return;

      const { data, error } = await supabase.from("messages").insert({
        id: messageId,
        room_id: roomId,
        content,
        user: {
          name: username,
          id: user.id,
        },
        metadata: {},
      });

      if (error) {
        console.error("Error persisting message", error);
        return;
      }
    },
    [isConnected, roomId, supabase, username]
  );

  // Atualizar mensagem
  const updateMessage = useCallback(
    async (id: string, content: string) => {
      const channel = channelRef.current;
      // guarda o valor anterior pra rollback em caso de falha
      let previousContent: string | null = null;

      setMessages((current) =>
        current.map((m) => {
          if (m.id === id) {
            previousContent = m.content;
            return { ...m, content, updated_at: new Date().toISOString() } as ChatMessage;
          }
          return m;
        })
      );

      try {
        if (channel && isConnected) {
          await channel.send({
            type: "broadcast",
            event: EVENT_UPDATE_TYPE,
            payload: { id, content, updated_at: new Date().toISOString() },
          });
        }

        const { error } = await supabase
          .from("messages")
          .update({ content })
          .eq("id", id);

        if (error) {
          throw error;
        }

        return previousContent;
      } catch (err) {
        console.error("Error updating message", err);
        // rollback
        setMessages((current) =>
          current.map((m) => (m.id === id ? { ...m, content: previousContent ?? m.content } : m))
        );
        return previousContent;
      }
    },
    [isConnected, supabase]
  );

  // Deletar mensagem
  const deleteMessage = useCallback(
    async (id: string) => {
      const channel = channelRef.current;
      // guarda a mensagem para rollback
      let removed: ChatMessage | null = null;

      setMessages((current) => {
        const found = current.find((m) => m.id === id) ?? null;
        removed = found;
        return current.filter((m) => m.id !== id);
      });

      try {
        if (channel && isConnected) {
          await channel.send({
            type: "broadcast",
            event: EVENT_DELETE_TYPE,
            payload: { id },
          });
        }

        const { error } = await supabase.from("messages").delete().eq("id", id);

        if (error) {
          throw error;
        }

        return removed;
      } catch (err) {
        console.error("Error deleting message", err);
        // rollback
        if (removed) {
          setMessages((current) => [...current, removed!].sort((a, b) => a.created_at.localeCompare(b.created_at)));
        }
        return removed;
      }
    },
    [isConnected, supabase]
  );



  return { messages, sendMessage, updateMessage, deleteMessage, isConnected, isLoading };
}
