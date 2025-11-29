import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from "../_service/rooms-service";

export function useRooms() {
  const {
    data: rooms,
    isLoading,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const queryclient = new QueryClient();

  const createNewRoom = useMutation({
    mutationFn: (name: string) => createRoom(name),
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["rooms"],
      });
      queryclient.refetchQueries({
        queryKey: ["rooms"],
      });
    },
  });

  const roomUpdate = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateRoom(id, name),
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["rooms"],
      });
      queryclient.refetchQueries({
        queryKey: ["rooms"],
      });
    },
  });

  const roomDelete = useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryclient.invalidateQueries({
        queryKey: ["rooms"],
      });
      queryclient.refetchQueries({
        queryKey: ["rooms"],
      });
    },
  });

  return {
    rooms,
    isLoading,
    refetchRooms,
    createNewRoom,
    roomUpdate,
    roomDelete,
  };
}
