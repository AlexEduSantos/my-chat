import { format } from "date-fns";
import { useUser } from "../_viewmodels/use-user";
import { Card } from "./ui/card";

interface messageProps {
  content: string;
  user: string;
  created_at: Date;
}
const MessageCard = ({ data }: { data: messageProps }) => {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div
      className={`w-full  flex flex-col gap-1 p-2 ${
        data.user === user!.id ? "items-end" : "items-start"
      }`}
    >
      <div className="text-xs text-muted-foreground px-1">
        {data.user === user!.id ? <p>{user?.username}</p> : <p>{data.user}</p>}
      </div>
      <Card className="p-2 px-4">{data.content}</Card>
      <p className="px-1 text-xs text-muted-foreground">{format(new Date(data.created_at), "HH:mm")}</p>
    </div>
  );
};

export default MessageCard;
