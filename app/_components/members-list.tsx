"use client";
import { useMembers, Member } from "../_viewmodels/use-rooms";
import { useDataContext } from "./_utils/data-context";

const MembersList = () => {
  const { roomName } = useDataContext();
  const { members, isLoading, isError } = useMembers(roomName);

  if (!roomName) return <p>Selecione uma sala</p>;
  if (isLoading) return <p>Carregando membros...</p>;
  if (isError) return <p>Erro ao carregar membros</p>;
  if (!members || members.length === 0) return <p>Nenhum membro no grupo</p>;

  return (
    <ul>
      {members.map((m: Member) => (
        <li key={m.user_id}>{m.user_name}</li>
      ))}
    </ul>
  );
};

export default MembersList;
