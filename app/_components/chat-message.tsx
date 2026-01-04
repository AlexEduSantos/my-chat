"use client";

import { cn } from "@/app/_lib/utils";
import type { ChatMessage } from "@/app/_hooks/use-realtime-chat";
import { PenIcon, Trash2Icon, CheckIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { useState } from "react";
import { useUser } from "../_viewmodels/use-user";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
  onEdit?: (
    id: string,
    content: string
  ) => Promise<string | null | undefined> | void;
  onDelete?: (id: string) => Promise<ChatMessage | null | undefined> | void;
}

// TODO: Adicionar botão de copiar mensagem para o clipboard em mensagens de outros usuários.

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
  onEdit,
  onDelete,
}: ChatMessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { users, isLoadingUsers } = useUser();

  if (isLoadingUsers) return null;

  const user = (id: string) => {
    return users?.find((user) => user.id === id)?.username;
  };

  const startEdit = () => {
    setEditValue(message.content);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditValue(message.content);
  };

  const saveEdit = async () => {
    const trimmed = editValue.trim();
    if (trimmed.length === 0) return;
    if (trimmed === message.content) {
      setIsEditing(false);
      return;
    }

    await onEdit?.(message.id, trimmed);
    setIsEditing(false);
  };

  const confirmDelete = () => setConfirmOpen(true);

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    await onDelete?.(message.id);
  };

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
            <span className={"font-medium"}>{user(message.user.id)}</span>
            <span className="text-foreground/50 text-xs">
              {new Date(message.created_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
        )}
        <div className="flex gap-2 items-center">
          <div className="group-hover:block hidden text-foreground/50">
            {isOwnMessage && (
              <>
                <Button variant="ghost" size="icon" onClick={confirmDelete}>
                  <Trash2Icon />
                </Button>
                {!isEditing && (
                  <Button variant="ghost" size="icon" onClick={startEdit}>
                    <PenIcon />
                  </Button>
                )}
              </>
            )}
          </div>

          <div
            className={cn(
              "py-2 px-3 rounded-xl text-sm w-fit hover:bg-primary/80",
              isOwnMessage
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-64"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEdit();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      cancelEdit();
                    }
                  }}
                />
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    onClick={saveEdit}
                    aria-label="Salvar mensagem"
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelEdit}
                    aria-label="Cancelar edição"
                  >
                    <XIcon />
                  </Button>
                </div>
              </div>
            ) : (
              <span>{message.content}</span>
            )}
          </div>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta mensagem? Esta ação{" "}
              <strong className="underline">não</strong> pode ser desfeita.
            </DialogDescription>
            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleDeleteConfirm}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
