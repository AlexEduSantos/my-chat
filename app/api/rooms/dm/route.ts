import { createClient } from "@/app/_lib/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const body = await req.json();
  const { friendId } = body;

  if (!friendId) {
    return NextResponse.json({ error: "friendId é obrigatório" }, { status: 400 });
  }

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

  // Busca salas (não-grupo) que contenham ambos os usuários
  try {
    const { data: members, error: membersError } = await supabase
      .from("room_members")
      .select("room_id, user_id")
      .in("user_id", [user.id, friendId]);

    if (membersError) {
      console.error("Erro ao buscar membros de sala:", membersError);
      return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }

    // Conta quantas vezes cada room_id aparece (precisamos de salas com ambos membros)
    const counts: Record<string, number> = {};
    (members || []).forEach((m: any) => {
      counts[m.room_id] = (counts[m.room_id] || 0) + 1;
    });

    const candidateRoomIds = Object.keys(counts).filter(
      (rid) => counts[rid] >= 2
    );

    if (candidateRoomIds.length > 0) {
      // Verifica se alguma dessas salas é realmente DM (is_group = false)
      const { data: rooms, error: roomsError } = await supabase
        .from("rooms")
        .select("*")
        .in("id", candidateRoomIds)
        .eq("is_group", false)
        .limit(1);

      if (roomsError) {
        console.error("Erro ao buscar salas candidatas:", roomsError);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
      }

      if (rooms && rooms.length > 0) {
        return NextResponse.json(rooms[0]);
      }
    }

    // Se não encontrar, cria uma nova sala DM e adiciona os membros
    const { data: newRoom, error: newRoomError } = await supabase
      .from("rooms")
      .insert({ is_group: false, creator_id: user.id })
      .select()
      .single();

    if (newRoomError) {
      console.error("Erro ao criar sala DM:", newRoomError);
      return NextResponse.json({ error: "Erro ao criar sala" }, { status: 500 });
    }

    const inserts = [
      { user_id: user.id, room_id: newRoom.id, user_name: user.user_metadata.username },
      { user_id: friendId, room_id: newRoom.id },
    ];

    const { error: membersInsertError } = await supabase
      .from("room_members")
      .insert(inserts);

    if (membersInsertError) {
      console.error("Erro ao inserir membros na sala DM:", membersInsertError);
      return NextResponse.json({ error: "Erro ao adicionar membros" }, { status: 500 });
    }

    return NextResponse.json(newRoom);
  } catch (err) {
    console.error("Erro ao processar DM:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
