"use client";
import { RealtimeChat } from "@/app/_components/realtime-chat";
import { useMessages } from "@/app/_viewmodels/use-messages";
import { useUser } from "@/app/_viewmodels/use-user";

const ChatPage = () => {
  const { messages, isLoading, sendNewMessage } = useMessages();
  const { user } = useUser();

  const roomName = "Geral";

  if (isLoading) {
    return <p>Loading...</p>;
  }
  
  return (
    <>
      <RealtimeChat roomName={roomName} username={user?.username || "test"} messages={messages} />
    </>
  );
};

export default ChatPage;
