import { Badge } from "@/components/ui/badge";

interface OrderItemProps {
  orderId: string;
  customerName: string;
  amount: string;
  status: "processing" | "shipped" | "delivered";
}

const OrderItem = ({ orderId, customerName, amount, status }: OrderItemProps) => {
  const statusColors = {
    processing: "bg-gray-500 hover:bg-gray-600",
    shipped: "bg-pink-500 hover:bg-pink-600",
    delivered: "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium">{orderId}</p>
        <p className="text-sm text-muted-foreground">{customerName}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-semibold">{amount}</p>
        <Badge className={statusColors[status]}>{status}</Badge>
      </div>
    </div>
  );
};

export default OrderItem;
