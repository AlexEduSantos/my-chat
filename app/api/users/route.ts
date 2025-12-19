import { createClient } from "@/app/_lib/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("*");

  if (usersError) {
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }

  return NextResponse.json(users);
}
