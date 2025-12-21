"use client";

import Image from "next/image";
import {
  EllipsisVerticalIcon,
  LogOutIcon,
  UserRoundPlusIcon,
  Users2Icon,
  UserIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import MembersList from "./members-list";
import { useRooms, useMembers } from "../_viewmodels/use-rooms";
import { useUser } from "../_viewmodels/use-user";
import { useDataContext } from "./_utils/data-context";
import { Trash2Icon } from "lucide-react";

interface ChatHeaderProps {
  roomId?: string | null;
}

const ChatHeader = ({ roomId }: ChatHeaderProps) => {
  const { rooms, dms, roomDelete, refetchRooms } = useRooms();
  const { members, isLoading: membersLoading } = useMembers(roomId ?? undefined);
  const { user } = useUser();
  const { setRoomId } = useDataContext();

  const room = (rooms || []).find((r) => r.id === roomId) || (dms || []).find((r) => r.id === roomId);

  const isDm = room && room.is_group === false;
  const other = isDm ? members?.find((m: any) => m.user_id !== user?.id) : null;

  const title = !roomId
    ? "Selecione uma sala"
    : isDm
    ? other?.full_name ?? other?.user_name ?? other?.username ?? "Conversa"
    : room?.name ?? "Sala";


  return (
    <div className="px-10 py-6 flex items-center justify-between w-full text-2xl font-bold absolute border-b bg-sidebar z-10">
      <div className="flex items-center gap-4">
        {isDm ? (
          <div className="relative h-10 w-10 rounded-full overflow-hidden border flex items-center justify-center">
            {other?.avatar_url ? (
              <Image
                src={other.avatar_url}
                alt={other?.user_name || other?.full_name || "Avatar"}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
        ) : null}

        <div className="text-2xl font-bold">{title}</div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0" size="icon-lg">
            <EllipsisVerticalIcon className="w-10 h-10" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isDm ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  // placeholder: abrir perfil do outro participante
                  if (other) {
                    window.location.href = `/users/${other.user_id}`;
                  }
                }}
              >
                <UserIcon />
                <p>Ver perfil</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (!room) return;
                  if (!confirm("Deseja excluir esta conversa?")) return;
                  roomDelete.mutate(room.id, {
                    onSuccess: () => {
                      refetchRooms();
                      setRoomId(null);
                    },
                    onError: (err) => {
                      console.error("Erro ao excluir conversa", err);
                      alert("Erro ao excluir conversa");
                    },
                  });
                }}
              >
                <Trash2Icon />
                <p>Excluir conversa</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRoundPlusIcon />
                <p>Convidar pessoas</p>
              </DropdownMenuItem>

              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Users2Icon />
                    <p>Ver participantes</p>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Membros</DialogTitle>
                  <MembersList />
                </DialogContent>
              </Dialog>

              <DropdownMenuItem variant="destructive">
                <LogOutIcon />
                <p>Sair da sala</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
