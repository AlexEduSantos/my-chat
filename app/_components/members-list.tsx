"use client";
import Image from "next/image";
import { useMembers, Member } from "../_viewmodels/use-rooms";
import { useDataContext } from "./_utils/data-context";
import { UserIcon } from "lucide-react";

const MembersList = () => {
  const { roomName } = useDataContext();
  const { members, isLoading, isError } = useMembers(roomName);

  if (!roomName) return <p>Selecione uma sala</p>;
  if (isLoading) return <p>Carregando membros...</p>;
  if (isError) return <p>Erro ao carregar membros</p>;
  if (!members || members.length === 0) return <p>Nenhum membro no grupo</p>;

  return (
    <div className="flex flex-col gap-2">
      {members.map((member: Member) => (
        <div key={member.user_id} className="flex items-center gap-2">
          {member.avatar_url ? (
            <div className="relative h-10 w-10 rounded-full overflow-hidden border flex items-center justify-center">
              <Image
                alt={`"Avatar" de ${member.user_name}`}
                src={member.avatar_url}
                loading="lazy"
                placeholder="blur"
                blurDataURL={member.avatar_url}
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="relative h-10 w-10 rounded-full overflow-hidden border flex items-center justify-center">
              <UserIcon />
            </div>
          )}

          <p>{member.user_name}</p>
        </div>
      ))}
    </div>
  );
};

export default MembersList;
