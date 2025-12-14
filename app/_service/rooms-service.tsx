export type rooms = {
  id: string;
  name: string;
  creator_id: string;
  metadata: {};
  created_at: string;
};

export const getRooms = async (): Promise<rooms[]> => {
  const res = await fetch("/api/rooms", {
    method: "GET",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.error) || "Erro ao buscar salas");
  }

  return res.json();
};

export const createRoom = async (name: string): Promise<rooms> => {
  const res = await fetch("/api/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.error) || "Erro ao criar sala");
  }

  return res.json();
};

export const updateRoom = async (id: string, name: string): Promise<rooms> => {
  const res = await fetch("/api/rooms", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.error) || "Erro ao atualizar sala");
  }

  return res.json();
};

export const deleteRoom = async (id: string): Promise<rooms> => {
  const res = await fetch("/api/rooms", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.error) || "Erro ao deletar sala");
  }

  return res.json();
};
