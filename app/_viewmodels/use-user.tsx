import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getUser } from "../_service/user-service";

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

  return { user, isLoading, refetchUser, users, isLoadingUsers };
}
