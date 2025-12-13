"use client";
import { RealtimeChat } from "@/app/_components/realtime-chat";
import { useMessages } from "@/app/_viewmodels/use-messages";
import { useUser } from "@/app/_viewmodels/use-user";

const ChatPage = () => {
  const { mockRoomId, messages, isLoading, sendNewMessage } = useMessages();
  const { user } = useUser();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  console.log(user)
  
  return (
    <>
      <RealtimeChat roomName="Sala de Teste A" username={user?.username || "test"} messages={messages} />
    </>
  );
};

export default ChatPage;
