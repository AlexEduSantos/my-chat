import { createClient } from "@/app/_lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);

  const isGroup = searchParams.get("isGroup");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_group", isGroup);

  if (roomsError) {
    return NextResponse.json(
      { error: "Erro ao buscar salas" },
      { status: 500 }
    );
  }

  return NextResponse.json(rooms);
}

export async function POST(req: Request) {
  const supabase = await createClient();

  const body = await req.json();
  const { name } = body;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .insert({ name: name, creator_id: user.id })
    .select()
    .single();

  if (roomError) {
    return NextResponse.json({ error: "Erro ao criar sala" }, { status: 500 });
  }

  const { data: roomMember, error: roomMemberError } = await supabase
    .from("room_members")
    .insert({
      user_id: user.id,
      room_id: room.id,
      user_name: user.user_metadata.username,
    })
    .select()
    .single();

  if (roomMemberError) {
    return NextResponse.json(
      { error: "Erro ao criar membro da sala" },
      { status: 500 }
    );
  }

  return NextResponse.json(room);
}

export async function DELETE(req: Request) {
  const supabase = await createClient();

  const body = await req.json();
  const { id } = body;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (roomError) {
    return NextResponse.json(
      { error: "Erro ao deletar sala" },
      { status: 500 }
    );
  }

  return NextResponse.json(room);
}

export async function PATCH(req: Request) {
  const supabase = await createClient();

  const body = await req.json();
  const { id, name } = body;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (roomError) {
    return NextResponse.json(
      { error: "Erro ao atualizar sala" },
      { status: 500 }
    );
  }

  return NextResponse.json(room);
}
