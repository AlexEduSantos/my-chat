import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../_service/message-service";

export type Message = {
  content: string;
  user: string;
  created_at: Date;
  room_id: string;
  id: string;
  metadata: JSON;
};

export function useMessages() {
  const mockRoomId = "97931ba4-c24b-4070-8ab7-6f92774b7461";

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(mockRoomId),
  });

  return { messages, isLoading, error };
}
