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

export const createRoom = async (name: string) => {
  const res = await fetch("/api/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Erro ao criar sala");

  return res.json();
};

export const updateRoom = async (id: string, name: string) => {
  const res = await fetch("/api/rooms", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name }),
  });

  if (!res.ok) throw new Error("Erro ao atualizar sala");

  return res.json();
};

export const deleteRoom = async (id: string) => {
  const res = await fetch("/api/rooms", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error("Erro ao deletar sala");
};
