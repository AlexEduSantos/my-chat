"use client";
import { RealtimeChat } from "@/app/_components/realtime-chat";
import { useUser } from "@/app/_viewmodels/use-user";
import { useDataContext } from "./_utils/data-context";

const ChatPage = () => {
  const { user, isLoading } = useUser();

  const { roomName } = useDataContext();

  if (isLoading) return;

  return (
    <>
      <RealtimeChat roomName={roomName} username={user?.username || "test"} />
    </>
  );
};

export default ChatPage;
