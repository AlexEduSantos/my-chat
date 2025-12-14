"use client";

import { createClient } from "@/app/_lib/client";
import { useCallback, useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";

interface UseRealtimeChatProps {
  roomName: string; // pode ser o id da sala (UUID) ou um slug; preferível usar o id (UUID)
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  user: {
    name: string;
  };
  created_at: string;
}

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([]);
  }, [roomName]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("id")
          .eq("name", roomName)
          .single();

        if (roomError || !roomData) {
          console.error("Error fetching room data", roomError);
          return;
        }

        const { data: msgs, error } = await supabase
          .from("messages")
          .select("id, content, user, created_at")
          .eq("room_id", roomData.id)
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
  }, [roomName, supabase]);

  useEffect(() => {
    const newChannel = supabase.channel(roomName);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload: any) => {
        try {
          const incoming: ChatMessage = payload.payload as ChatMessage;
          if (!incoming || !incoming.id) return;

          // if (receivedIds.has(incoming.id)) return;
          // receivedIds.add(incoming.id);

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
      .subscribe((status: any) => {
        console.log("Channel subscription status:", status);
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
  }, [roomName, supabase]);

  // Trecho relevante do hook: função sendMessage que persiste no banco
  const sendMessage = useCallback(
    async (content: string) => {
      const channel = channelRef.current;
      if (!channel || !isConnected) return;

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

      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("id")
        .eq("name", roomName)
        .single();

      if (roomError || !roomData) {
        console.error("Error fetching room data", roomError);
        return;
      }

      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (userError || !user) return;

      const { data, error } = await supabase.from("messages").insert({
        id: messageId,
        room_id: roomData.id,
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
    [isConnected, roomName, supabase, username]
  );

  return { messages, sendMessage, isConnected, isLoading };
}
