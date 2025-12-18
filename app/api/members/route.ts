import { createClient } from "@/app/_lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);

  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json(
      { error: "ID da sala (roomId) é obrigatório." },
      { status: 400 }
    );
  }

  const { data: members, error: membersError } = await supabase
    .from("room_members")
    .select("*")
    .eq("room_id", roomId);

  if (membersError) {
    console.error("Supabase error:", membersError);
    return NextResponse.json(
      { error: "Erro ao buscar membros" },
      { status: 500 }
    );
  }

  return NextResponse.json(members);
}
