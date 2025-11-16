import { useState } from "react";
import { User, Lock, Mail, Phone } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AdminSettings = () => {
  const { toast } = useToast();
  const [adminData, setAdminData] = useState({
    name: "Super Admin",
    email: "admin@akmart.com",
    phone: "+1 234 567 8900"
  });

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setAdminData({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string
    });
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    // In real app, validate with backend
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully."
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="settings" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your admin account settings</p>
        </div>

        <div className="grid gap-6 max-w-3xl">
          <div className="bg-background rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  SA
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{adminData.name}</h2>
                <p className="text-muted-foreground">Administrator</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input id="name" name="name" defaultValue={adminData.name} required />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input id="email" name="email" type="email" defaultValue={adminData.email} required />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input id="phone" name="phone" type="tel" defaultValue={adminData.phone} required />
              </div>

              <Button type="submit">Update Profile</Button>
            </form>
          </div>

          <div className="bg-background rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Change Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" required />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>

              <Button type="submit">Change Password</Button>
            </form>
          </div>

          <div className="bg-background rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type:</span>
                <span className="font-semibold">Super Admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Status:</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since:</span>
                <span className="font-semibold">January 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login:</span>
                <span className="font-semibold">Today at 9:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
