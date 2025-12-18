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

export const sendMessage = async (message: string, roomId: string) => {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, roomId }),
  });

  if (!res.ok) throw new Error("Erro ao enviar mensagem");

  return res.json();
};

export const deleteMessage = async (id: string) => {
  const res = await fetch("/api/messages", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error("Erro ao deletar mensagem");

  return res.json();
};

export const updateMessage = async (id: string, message: string) => {
  const res = await fetch("/api/messages", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, message }),
  });

  if (!res.ok) throw new Error("Erro ao atualizar mensagem");

  return res.json();
};
