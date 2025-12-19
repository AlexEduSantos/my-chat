import { createClient } from "../_lib/client";

export type UserData = {
  id: string;
  email: string;
  username: string | null;
  avatar: string | null;
};

export type UpdateUserData = {
  username?: string;
  avatar?: string;
};

export const getUser = async (): Promise<UserData> => {
  const res = await fetch("/api/user", {
    method: "GET",
  });

  if (!res.ok) throw new Error("Erro ao buscar usuário");

  return res.json();
};

export const updateUser = async (data: UpdateUserData): Promise<UserData> => {
  const res = await fetch("/api/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao atualizar usuário");

  return res.json();
};

export const uploadAvatar = async (
  file: File,
  userId: string
): Promise<string[]> => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}.${fileExt}`;

  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (error) throw new Error("Erro ao fazer upload do avatar.");

  const { data: publicUrl } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);
  return [publicUrl.publicUrl];
};

export const getAllUsers = async (): Promise<UserData[]> => {
  const res = await fetch("/api/users", {
    method: "GET",
  });

  if (!res.ok) throw new Error("Erro ao buscar usuários");

  return res.json();
};
