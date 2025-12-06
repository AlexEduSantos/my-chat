import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../_service/message-service";
import { useEffect, useState } from "react";
import { createClient } from "../_lib/client";

export type Message = {
  content: string;
  user: string;
  created_at: Date;
  room_id: string;
  id: string;
};

export function useMessages() {
  const mockRoomId = "97931ba4-c24b-4070-8ab7-6f92774b7461";
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(mockRoomId),
  });

  const supabase = createClient();

  useEffect(() => {
    if (messages) {
      setAllMessages(messages);
    }

    const channel = supabase
      .channel("room-1")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${mockRoomId}`,
        },
        (payload) => {
          setAllMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messages, mockRoomId, supabase]);

  const queryclient = new QueryClient();

  const sendNewMessage = useMutation({
    mutationFn: (message: string) => sendMessage(message, mockRoomId),
    onSuccess: () => {
      // No need to invalidate or refetch queries, real-time subscription handles updates.
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendNewMessage,
    allMessages,
    setAllMessages,
    mockRoomId,
  };
}
