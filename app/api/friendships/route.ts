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

  const { data: friendships, error: friendshipsError } = await supabase.rpc(
    "get_friends_with_profiles",
    { r: user.id } // usar o nome do parâmetro da função
  );

  if (friendshipsError) {
    return NextResponse.json(
      { error: "Erro ao buscar amizades" },
      { status: 500 }
    );
  }

  return NextResponse.json(friendships);
}
