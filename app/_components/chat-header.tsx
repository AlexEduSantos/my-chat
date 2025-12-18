import {
  EllipsisVerticalIcon,
  LogOutIcon,
  UserRoundPlusIcon,
  Users2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ChatHeaderProps {
  roomName: string;
}

const ChatHeader = ({ roomName }: ChatHeaderProps) => {
  return (
    <div className="px-10 py-6 flex items-center justify-between w-full text-2xl font-bold absolute border-b bg-sidebar z-10">
      {roomName}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0" size="icon-lg">
            <EllipsisVerticalIcon className="w-10 h-10" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserRoundPlusIcon />
              <p>Convidar pessoas</p>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users2Icon />
              <p>Ver participantes</p>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <LogOutIcon />
              <p>Sair da sala</p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
