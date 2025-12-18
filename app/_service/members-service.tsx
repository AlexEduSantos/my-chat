export const getMembers = async (roomId: string) => {
  const res = await fetch(`/api/members?roomId=${roomId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Erro ao buscar membros");

  return res.json();
};
