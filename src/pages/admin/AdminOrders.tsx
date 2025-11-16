import { useState } from "react";
import { Eye } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  amount: number;
  status: OrderStatus;
  date: string;
  items: { name: string; quantity: number; price: number }[];
}

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderId: "#12345",
      customerName: "John Doe",
      email: "john@example.com",
      amount: 299.99,
      status: "processing",
      date: "2024-01-15",
      items: [{ name: "Product A", quantity: 2, price: 149.99 }]
    },
    {
      id: "2",
      orderId: "#12346",
      customerName: "Jane Smith",
      email: "jane@example.com",
      amount: 599.50,
      status: "shipped",
      date: "2024-01-14",
      items: [{ name: "Product B", quantity: 1, price: 599.50 }]
    },
    {
      id: "3",
      orderId: "#12347",
      customerName: "Bob Wilson",
      email: "bob@example.com",
      amount: 149.99,
      status: "delivered",
      date: "2024-01-13",
      items: [{ name: "Product C", quantity: 1, price: 149.99 }]
    }
  ]);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`
    });
  };

  const statusColors = {
    processing: "bg-gray-500 hover:bg-gray-600",
    shipped: "bg-pink-500 hover:bg-pink-600",
    delivered: "bg-blue-500 hover:bg-blue-600",
    cancelled: "bg-red-500 hover:bg-red-600"
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="orders" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="text-2xl font-bold text-gray-600">
              {orders.filter(o => o.status === "processing").length}
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Shipped</p>
            <p className="text-2xl font-bold text-pink-600">
              {orders.filter(o => o.status === "shipped").length}
            </p>
          </div>
          <div className="bg-background p-4 rounded-lg shadow-sm">
            <p className="text-sm text-muted-foreground">Delivered</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === "delivered").length}
            </p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-sm p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select 
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewingOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {viewingOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-semibold">{viewingOrder.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={statusColors[viewingOrder.status]}>
                      {viewingOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-semibold">{viewingOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{viewingOrder.date}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="font-semibold mb-2">Order Items</p>
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t mt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${viewingOrder.amount.toFixed(2)}</span>
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

export default AdminOrders;
