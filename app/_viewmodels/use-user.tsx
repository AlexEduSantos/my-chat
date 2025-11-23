import { useQuery } from "@tanstack/react-query";
import { getUser } from "../_service/user-service";

export function useUser() {
  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return { user, isLoading, refetchUser };
}
