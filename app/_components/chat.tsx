"use client";

import { SendIcon } from "lucide-react";
import { Message, useMessages } from "../_viewmodels/use-messages";
import MessageCard from "./message";
import { Input } from "./ui/input";

const ChatTest = () => {
  const { messages, isLoading, error } = useMessages();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (messages) console.log(messages);

  return (
    <div className="w-full h-full p-2 flex flex-col-reverse">
      <div className="flex gap-2 items-center">
        <Input placeholder="Message" className="" />
        <SendIcon />
      </div>
      {messages.map((message: Message) => (
        <div key={message.id}>
          <MessageCard data={message} />
        </div>
      ))}
    </div>
  );
};

export default ChatTest;
