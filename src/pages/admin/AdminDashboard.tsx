import { DollarSign, Package, Users, ShoppingCart, TrendingUp, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatCard from "@/components/admin/StatCard";
import UserActivityItem from "@/components/admin/UserActivityItem";
import OrderItem from "@/components/admin/OrderItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeItem="dashboard" />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                Dashboard
                <Badge className="bg-green-500 hover:bg-green-600">Live Dashboard</Badge>
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>11/11/2025, 11:55:06 pm</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value="₹577.9"
              icon={DollarSign}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              change="+12.5%"
              changePositive={true}
              onClick={() => navigate("/admin/analytics")}
            />
            <StatCard
              title="Products"
              value="0"
              icon={Package}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              subtitle="0 low stock"
              onClick={() => navigate("/admin/products")}
            />
            <StatCard
              title="Active Users"
              value="3"
              icon={Users}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              change="+8.3%"
              changePositive={true}
              onClick={() => navigate("/admin/users")}
            />
            <StatCard
              title="Orders"
              value="3"
              icon={ShoppingCart}
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
              change="+15.7%"
              changePositive={true}
              onClick={() => navigate("/admin/orders")}
            />
          </div>

          {/* Charts and Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="inline-flex gap-2">
                        <div className="w-12 h-24 bg-muted rounded"></div>
                        <div className="w-12 h-32 bg-muted rounded"></div>
                        <div className="w-12 h-20 bg-muted rounded"></div>
                      </div>
                    </div>
                    <p className="text-sm font-medium">Sales Chart</p>
                    <p className="text-xs">Chart visualization would be here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="h-5 w-5" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <UserActivityItem
                  name="John Doe"
                  lastSeen="2 minutes ago"
                  status="active"
                />
                <UserActivityItem
                  name="Priya Sharma"
                  lastSeen="15 minutes ago"
                  status="active"
                />
                <UserActivityItem
                  name="Rahul Patel"
                  lastSeen="1 hour ago"
                  status="active"
                />
                <UserActivityItem
                  name="Sneha Reddy"
                  lastSeen="2 days ago"
                  status="banned"
                />
              </CardContent>
            </Card>
          </div>

          {/* Orders and Products Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="link" className="text-primary" onClick={() => navigate("/admin/orders")}>
                  View All →
                </Button>
              </CardHeader>
              <CardContent>
                <OrderItem
                  orderId="ORD001"
                  customerName="John Doe"
                  amount="₹299"
                  status="processing"
                />
                <OrderItem
                  orderId="ORD002"
                  customerName="Priya Sharma"
                  amount="₹149"
                  status="shipped"
                />
                <OrderItem
                  orderId="ORD003"
                  customerName="Rahul Patel"
                  amount="₹129.9"
                  status="delivered"
                />
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Products</CardTitle>
                <Button variant="link" className="text-primary" onClick={() => navigate("/admin/products")}>
                  View All →
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Top products will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
