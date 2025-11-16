import { useState } from "react";
import { UserX, UserCheck, Eye } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "banned";
  joinDate: string;
  lastSeen: string;
  orders: number;
  avatar?: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", status: "active", joinDate: "2024-01-10", lastSeen: "2 hours ago", orders: 15 },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "active", joinDate: "2024-01-08", lastSeen: "1 day ago", orders: 8 },
    { id: "3", name: "Bob Wilson", email: "bob@example.com", status: "banned", joinDate: "2023-12-20", lastSeen: "1 week ago", orders: 3 }
  ]);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === "active" ? "banned" : "active";
        toast({
          title: newStatus === "banned" ? "User Banned" : "User Unbanned",
          description: `${user.name} has been ${newStatus}.`
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="users" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>

        <div className="bg-background rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === "active").length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Banned Users</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === "banned").length}
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const initials = user.name.split(" ").map(n => n[0]).join("");
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={
                        user.status === "active" 
                          ? "bg-blue-500 hover:bg-blue-600" 
                          : "bg-pink-500 hover:bg-pink-600"
                      }>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell className="text-muted-foreground">{user.lastSeen}</TableCell>
                    <TableCell>{user.orders}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewingUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === "active" ? (
                            <UserX className="h-4 w-4 text-red-600" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {viewingUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={viewingUser.avatar} alt={viewingUser.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {viewingUser.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{viewingUser.name}</h3>
                    <p className="text-muted-foreground">{viewingUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={
                      viewingUser.status === "active" 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "bg-pink-500 hover:bg-pink-600"
                    }>
                      {viewingUser.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="font-semibold">{viewingUser.orders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Join Date</p>
                    <p className="font-semibold">{viewingUser.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Seen</p>
                    <p className="font-semibold">{viewingUser.lastSeen}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminUsers;
