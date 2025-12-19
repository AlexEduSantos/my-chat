"use client"
import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../_service/friendship-service";

export const useFriendship = () => {
  const { data: friendships, isLoading } = useQuery({
    queryKey: ["friendships"],
    queryFn: getFriends,
  });

  console.log(friendships);
  return { friendships, isLoading };
};
