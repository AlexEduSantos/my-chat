import { createClient } from "@/app/_lib/server";
import { metadata } from "@/app/layout";
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

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const { message, roomId } = body;

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const metadata = {
    avatar: user.user.user_metadata.avatar,
    username: user.user.user_metadata.username,
  };

  const { data: newMessage, error: messageError } = await supabase
    .from("messages")
    .insert({
      content: message,
      user: user.user.id,
      room_id: roomId,
      metadata: metadata,
    })
    .select("*")
    .single();

  if (messageError) {
    return NextResponse.json(
      { error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }

  return NextResponse.json(newMessage);
}
