"use client";

import { useFriendship } from "@/app/_viewmodels/use-friendship";

const FriendsList = () => {
  const { friendships, isLoading } = useFriendship();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {friendships?.map((friendship) => (
        <div key={friendship.friend_id}>
            <p>{friendship.full_name}</p>
        </div>
      ))}
    </>
  );
};

export default FriendsList;
