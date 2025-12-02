export const getMessages = async (id: string) => {
  // 1. Constrói a URL com o parâmetro de consulta (query parameter)
  const url = `/api/messages?roomId=${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // 2. Remove o corpo (body), pois é um GET
    // body: JSON.stringify({ id }), <--- REMOVIDO!
  });

  if (!res.ok) throw new Error("Erro ao buscar mensagem");

  return res.json();
};
