import { useState } from "react";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("weekly");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="analytics" />
      
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground mt-1">Track your business performance</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">$45,231</p>
            <p className="text-sm text-green-600 mt-1">↑ 12.5% from last {period}</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Orders</p>
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-blue-600 mt-1">↑ 8.3% from last {period}</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Customers</p>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">892</p>
            <p className="text-sm text-purple-600 mt-1">↑ 15.2% from last {period}</p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Conversion</p>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">3.2%</p>
            <p className="text-sm text-orange-600 mt-1">↑ 2.1% from last {period}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-background rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
            <div className="h-80 flex items-center justify-center border-2 border-dashed border-muted rounded">
              <p className="text-muted-foreground">Chart will be displayed here</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
            <div className="h-80 flex items-center justify-center border-2 border-dashed border-muted rounded">
              <p className="text-muted-foreground">Chart will be displayed here</p>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Direct</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Social Media</span>
                <span className="font-semibold">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Search Engines</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
            <div className="space-y-3">
              {["Product A", "Product B", "Product C", "Product D", "Product E"].map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <span className="font-medium">{product}</span>
                  <span className="text-muted-foreground">${Math.floor(Math.random() * 5000)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
