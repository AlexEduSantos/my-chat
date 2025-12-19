import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  deleteRoom,
  getDms,
  getRooms,
  updateRoom,
} from "../_service/rooms-service";
import { getMembers } from "../_service/members-service";

export function useRooms() {
  const {
    data: rooms,
    isLoading,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const { data: dms, isLoading: isLoadingDms } = useQuery({
    queryKey: ["dms"],
    queryFn: getDms,
  });

  const queryClient = useQueryClient();

  const createNewRoom = useMutation({
    mutationFn: (name: string) => createRoom(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      queryClient.refetchQueries({
        queryKey: ["rooms"],
      });
    },
  });

  const roomUpdate = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateRoom(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      queryClient.refetchQueries({
        queryKey: ["rooms"],
      });
    },
  });

  const roomDelete = useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
      queryClient.refetchQueries({
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
    dms,
    isLoadingDms,
  };
}

export type Member = {
  user_id: string;
  user_name: string;
  joined_at: string;
  avatar_url: string;
  full_name: string;
  room_id: string;
  username: string;
};

export function useMembers(roomName?: string) {
  const queryClient = useQueryClient();

  const {
    data: members,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["roomMembers", roomName],
    queryFn: async () => {
      if (!roomName) return [] as Member[];

      // Garante que a lista de salas esteja disponível: busca se não estiver em cache
      const rooms = (await queryClient.fetchQuery({
        queryKey: ["rooms"],
        queryFn: getRooms,
      })) as { id: string; name: string }[] | undefined;

      const room = rooms?.find((r) => r.name === roomName);
      if (!room) return [] as Member[];

      const members = await getMembers(room.id);
      return members;
    },
    enabled: !!roomName,
  });

  return {
    members,
    isLoading,
    isError,
    refetch,
  };
}
