import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  status: string;
  order_date: string;
  delivered_date: string | null;
  products: {
    name: string;
    image_url: string | null;
  };
}

interface PurchasedProductsTabProps {
  userId: string;
  isOwnProfile: boolean;
}

const PurchasedProductsTab = ({ userId, isOwnProfile }: PurchasedProductsTabProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products (
            name,
            image_url
          )
        `)
        .eq("user_id", userId)
        .order("order_date", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500 hover:bg-green-600";
      case "shipped":
        return "bg-blue-500 hover:bg-blue-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {isOwnProfile ? "You haven't purchased anything yet" : "No purchases yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                {order.products.image_url ? (
                  <img
                    src={order.products.image_url}
                    alt={order.products.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{order.products.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {order.quantity}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="flex justify-between items-end">
                  <div className="text-sm text-muted-foreground">
                    <p>Ordered: {format(new Date(order.order_date), "MMM dd, yyyy")}</p>
                    {order.delivered_date && (
                      <p>Delivered: {format(new Date(order.delivered_date), "MMM dd, yyyy")}</p>
                    )}
                  </div>
                  <p className="font-semibold text-lg">
                    ${order.total_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PurchasedProductsTab;
