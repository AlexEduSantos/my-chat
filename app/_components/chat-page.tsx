"use client";
import { RealtimeChat } from "@/app/_components/realtime-chat";
import { useUser } from "@/app/_viewmodels/use-user";
import { useDataContext } from "./_utils/data-context";

const ChatPage = () => {
  const { user, isLoading } = useUser();

  const { roomId } = useDataContext();

  if (isLoading) return;

  return (
    <>
      <RealtimeChat roomId={roomId} username={user?.username || "test"} />
    </>
  );
};

export default ChatPage;
