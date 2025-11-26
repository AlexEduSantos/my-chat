import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../_service/rooms-service";

export function useRooms() {
  const {
    data: rooms,
    isLoading,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  return { rooms, isLoading, refetchRooms };
}
