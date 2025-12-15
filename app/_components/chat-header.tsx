interface ChatHeaderProps {
  roomName: string;
}

const ChatHeader = ({ roomName }: ChatHeaderProps) => {
  return (
    <div className="px-10 py-6 flex items-center w-full text-2xl font-bold absolute border-b bg-sidebar z-10">
      {roomName}
    </div>
  );
};

export default ChatHeader;
