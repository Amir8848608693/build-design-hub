import { Home, Package, Warehouse, Users, ShoppingBag, RotateCcw, BarChart3, Gift, MessageSquare, Bell, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeItem?: string;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "products", label: "Products", icon: Package },
  { id: "inventory", label: "Inventory", icon: Warehouse },
  { id: "users", label: "Users", icon: Users },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "offers", label: "Offers & Promotions", icon: Gift },
  { id: "social", label: "Social", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

const AdminSidebar = ({ activeItem = "dashboard" }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#1a1f2e] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">AKMART Admin</h1>
        </div>
        <p className="text-sm text-white/60 mt-1">Control Panel</p>
        <span className="inline-block mt-2 px-2 py-1 bg-primary text-xs rounded">Live</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                isActive 
                  ? "bg-white/10 text-white border-l-4 border-primary" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium">SA</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Super Admin</p>
            <p className="text-xs text-white/60">Full Access</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/5"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
