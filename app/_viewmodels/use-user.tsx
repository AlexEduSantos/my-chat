import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getUser,
  updateUser,
  UpdateUserData,
  uploadAvatar,
  UserData,
} from "../_service/user-service";
import { toast } from "sonner";

export function useUser() {
  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      await updateUser(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });

  type updateUserForm = {
    username: string;
    avatar?: File;
  };

  const submitUpdateUser = async (data: updateUserForm) => {
    try {
      if (data.avatar) {
        const avatarUrl = await uploadAvatar(data.avatar, user!.id);

        updateUserMutation.mutate({
          username: data.username,
          avatar: avatarUrl[0],
        });
      } else {
        updateUserMutation.mutate({
          username: data.username,
        });
      }

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil.");
    }
  };

  return {
    user,
    isLoading,
    refetchUser,
    users,
    isLoadingUsers,
    submitUpdateUser,
  };
}
