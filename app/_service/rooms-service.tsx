export type rooms = {
  id: string;
  room_name: string;
  owner: string;
  members: [];
  createdAt: string;
};

export const getRooms = async (): Promise<rooms[]> => {
  const res = await fetch("/api/rooms", {
    method: "GET",
  });

  if (!res.ok) throw new Error("Erro ao buscar salas");

  return res.json();
};
