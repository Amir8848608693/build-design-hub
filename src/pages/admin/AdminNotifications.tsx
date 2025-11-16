import { useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  time: string;
  read: boolean;
}

const AdminNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "New Order", message: "Order #12348 has been placed", type: "success", time: "5 min ago", read: false },
    { id: "2", title: "Low Stock Alert", message: "Product A is running low on stock", type: "warning", time: "1 hour ago", read: false },
    { id: "3", title: "Return Request", message: "Customer requested return for Order #12345", type: "info", time: "2 hours ago", read: true },
    { id: "4", title: "Payment Failed", message: "Payment failed for Order #12349", type: "error", time: "3 hours ago", read: true }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read."
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({
      title: "All marked as read",
      description: "All notifications have been marked as read."
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({
      title: "Notification deleted",
      description: "Notification has been removed."
    });
  };

  const typeColors = {
    info: "bg-blue-500 hover:bg-blue-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    success: "bg-green-500 hover:bg-green-600",
    error: "bg-red-500 hover:bg-red-600"
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="notifications" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600">
                    {unreadCount} new
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">Stay updated with important alerts</p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-sm p-6">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={typeColors[notification.type]}>
                          {notification.type}
                        </Badge>
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">{notification.time}</p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminNotifications;
