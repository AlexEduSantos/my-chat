export type rooms = {
  id: string;
  name?: string;
  creator_id: string;
  metadata: {};
  created_at: string;
  is_group?: boolean;
};

export const getRooms = async (): Promise<rooms[]> => {
  const res = await fetch("/api/rooms?isGroup=true", {
    method: "GET",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.error) || "Erro ao buscar salas");
  }

  return res.json();
};

export const getDms = async (): Promise<rooms[]> => {
  const res = await fetch("/api/rooms?isGroup=false", {
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

export const getOrCreateDm = async (friendId: string): Promise<rooms> => {
  const res = await fetch("/api/rooms/dm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ friendId }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.error) || "Erro ao obter/ criar DM");
  }

  return res.json();
};
