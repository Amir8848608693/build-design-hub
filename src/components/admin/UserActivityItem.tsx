import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserActivityItemProps {
  name: string;
  lastSeen: string;
  status: "active" | "banned";
  avatar?: string;
}

const UserActivityItem = ({ name, lastSeen, status, avatar }: UserActivityItemProps) => {
  const initials = name.split(" ").map(n => n[0]).join("");
  
  return (
    <div className="flex items-center justify-between py-3 hover:bg-muted/50 px-4 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">Last seen: {lastSeen}</p>
        </div>
      </div>
      <Badge 
        className={
          status === "active" 
            ? "bg-blue-500 hover:bg-blue-600" 
            : "bg-pink-500 hover:bg-pink-600"
        }
      >
        {status}
      </Badge>
    </div>
  );
};

export default UserActivityItem;
