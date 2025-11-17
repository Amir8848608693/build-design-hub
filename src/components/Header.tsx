import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, MessageSquare, UserCog, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight">AKMART</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 bg-muted/50 border-border"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/admin/login')}>
              <UserCog className="h-4 w-4" />
              <span className="hidden md:inline text-primary">Admin</span>
            </Button>
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/chat')}>
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden md:inline">Chat</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Profile</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/auth')}>
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" className="gap-2 relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Cart</span>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-discount text-discount-foreground">
                0
              </Badge>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
