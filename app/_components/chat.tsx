"use client";

import { SendIcon } from "lucide-react";
import { Message, useMessages } from "../_viewmodels/use-messages";
import MessageCard from "./message";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUser } from "../_viewmodels/use-user";
import { v4 as uuid } from "uuid";

type ExtendedMessage = Message & {
  metadata: JSON;
};

const ChatTest = () => {
  const {
    messages,
    isLoading,
    error,
    sendNewMessage,
    allMessages,
    setAllMessages,
    mockRoomId,
  } = useMessages();

  const { user, isLoading: isLoadingUser } = useUser();

  if (isLoading || isLoadingUser) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (messages) console.log(messages);

  return (
    <div className="w-full h-full p-2 flex flex-col-reverse">
      <form
        className="flex gap-2 items-center"
        onSubmit={(e) => {
          e.preventDefault();

          const form = e.currentTarget;
          const formData = new FormData(form);

          const message = formData.get("message") as string;
          if (!message || message.trim() === "") {
            alert("Mensagem obrigatório");
            return;
          }

          sendNewMessage.mutate(message);

          form.reset();
        }}
      >
        <Input placeholder="Message" className="" name="message" />
        <Button variant="secondary">
          <SendIcon />
        </Button>
      </form>
      {allMessages.map((message: Message) => (
        <div key={message.id}>
          <MessageCard data={message} />
        </div>
      ))}
    </div>
  );
};

export default ChatTest;
