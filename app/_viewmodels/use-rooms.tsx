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

export function useMembers(roomId?: string) {
  const queryClient = useQueryClient();

  const {
    data: members,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["roomMembers", roomId],
    queryFn: async () => {
      if (!roomId) return [] as Member[];

      const members = await getMembers(roomId);
      return members;
    },
    enabled: !!roomId,
  });

  return {
    members,
    isLoading,
    isError,
    refetch,
  };
}
