export type rooms = {
  id: string;
  name: string;
  owner: string;
  members: [];
  createdAt: string;
};

export const getRooms = async (): Promise<rooms[]> => {
  const res = await fetch("/api/user/rooms", {
    method: "GET",
  });

  if (!res.ok) throw new Error("Erro ao buscar salas");

  return res.json();
};
