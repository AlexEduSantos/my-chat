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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return NextResponse.json(
      { error: "Perfil não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    username: profile.username,
    full_name: profile.full_name,
    avatar: profile.avatar_url,
  });
}

export async function PUT(req: Request) {
  const supabase = await createClient();

  const body = await req.json();
  const { username, avatar } = body;

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

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      username,
      avatar_url: avatar,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar")
    .eq("id", user.id)
    .single();

  if (profile?.avatar) {
    await supabase.storage.from("avatars").remove([profile.avatar]);
  }

  await supabase.from("profiles").delete().eq("id", user.id);

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Erro ao excluir usuário" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
