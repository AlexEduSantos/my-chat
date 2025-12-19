export type Friendships = {
  avatar_url: string;
  created_at: Date;
  friend_id: string;
  full_name: string;
  user_id: string;
  username: string;
};
export const getFriends = async (): Promise<Friendships[]> => {
  const res = await fetch("/api/friendships", {
    method: "GET",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error((body && body.error) || "Erro ao buscar amizades");
  }

  return res.json();
};
