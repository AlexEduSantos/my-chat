import { createClient } from "@/app/_lib/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

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
    .filter("oowner", "eq", user.id);

  if (roomsError) {
    return NextResponse.json(
      { error: "Erro ao buscar salas" },
      { status: 500 }
    );
  }

  return NextResponse.json(rooms);
}
