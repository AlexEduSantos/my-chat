"use client";
import { RealtimeChat } from "@/app/_components/realtime-chat";
import { useUser } from "@/app/_viewmodels/use-user";
import { useDataContext } from "./_utils/data-context";
import { Button } from "./ui/button";
import { UsersIcon, ZapIcon } from "lucide-react";

const ChatPage = () => {
  const { user, isLoading } = useUser();

  const { roomId } = useDataContext();

  if (isLoading) return;

  if (roomId === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 md:gap-6 mt-8 max-w-xl mx-auto">
          <div className="space-y-3">
            <h1 className="text-primary text-3xl md:text-5xl">
              Bem-vindo ao LiquidChat
            </h1>
            <p className="text-primaryprimary/70 text-lg md:text-xl max-w-md mx-auto">
              Conecte-se com amigos ou participe de salas públicas
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 max-w-xl mx-auto">
            {/* Public Rooms */}
            <div className="backdrop-blur-xl bg-primary/5 border border-primary/10 rounded-2xl p-6 hover:bg-primary/10 transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto border border-primary/20">
                <UsersIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-primary mb-2">Salas Públicas</h3>
              <p className="text-primary/60 text-sm">
                Participe de conversas abertas com toda a comunidade
              </p>
            </div>

            {/* Private Chats */}
            <div className="backdrop-blur-xl bg-primary/5 border border-primary/10 rounded-2xl p-6 hover:bg-primary/10 transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto border border-primary/20">
                <ZapIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-primary mb-2">Conversas Privadas</h3>
              <p className="text-primary/60 text-sm">
                Chat direto e privado com seus amigos online
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RealtimeChat roomId={roomId} username={user?.username || "test"} />
    </>
  );
};

export default ChatPage;
