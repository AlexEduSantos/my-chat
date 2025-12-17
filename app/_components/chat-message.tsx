import { cn } from "@/app/_lib/utils";
import type { ChatMessage } from "@/app/_hooks/use-realtime-chat";
import { PenIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
}

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
}: ChatMessageItemProps) => {
  return (
    <div
      className={`flex mt-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={cn("max-w-[75%] w-fit flex flex-col gap-1 group", {
          "items-end": isOwnMessage,
        })}
      >
        {showHeader && (
          <div
            className={cn("flex items-center gap-2 text-xs px-3", {
              "justify-end flex-row-reverse": isOwnMessage,
            })}
          >
            <span className={"font-medium"}>{message.user.name}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        )}
        <div className="flex gap-2">
          <div className="group-hover:block hidden text-foreground/50">
            <Button variant="ghost" size="icon">
              <Trash2Icon />
            </Button>
            <Button variant="ghost" size="icon">
              <PenIcon />
            </Button>
          </div>
          <div
            className={cn(
              "py-2 px-3 rounded-xl text-sm w-fit hover:bg-primary/80",
              isOwnMessage
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};
