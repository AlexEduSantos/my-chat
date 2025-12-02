import { createClient } from "@/app/_lib/server";
import { NextResponse } from "next/server";

// O handler GET recebe o objeto Request e o objeto de contexto
export async function GET(request: Request) {
  const supabase = await createClient();

  // 1. Extrai os parâmetros de consulta (searchParams) da URL
  const { searchParams } = new URL(request.url);

  // 2. Busca o valor 'roomId' do parâmetro de consulta
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json(
      { error: "ID da sala (roomId) é obrigatório." },
      { status: 400 }
    );
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("room_id", roomId) // Usa o roomId extraído da URL
    .order("created_at", { ascending: false });

  if (messagesError) {
    console.error("Supabase error:", messagesError);
    return NextResponse.json(
      { error: "Erro ao buscar mensagens" },
      { status: 500 }
    );
  }

  return NextResponse.json(messages);
}
