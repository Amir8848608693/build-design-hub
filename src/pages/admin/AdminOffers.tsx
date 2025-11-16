import { useState } from "react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  code: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

const AdminOffers = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "1",
      title: "Summer Sale",
      description: "Get 25% off on all products",
      discountPercent: 25,
      code: "SUMMER25",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      active: true
    },
    {
      id: "2",
      title: "New Customer Discount",
      description: "Special discount for first-time buyers",
      discountPercent: 15,
      code: "WELCOME15",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      active: true
    }
  ]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const handleAddOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOffer: Offer = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      discountPercent: Number(formData.get("discount")),
      code: formData.get("code") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      active: true
    };
    setOffers([...offers, newOffer]);
    setIsAddOpen(false);
    toast({
      title: "Offer Created",
      description: "New promotional offer has been created."
    });
  };

  const handleEditOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOffer) return;
    const formData = new FormData(e.currentTarget);
    const updatedOffer: Offer = {
      ...editingOffer,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      discountPercent: Number(formData.get("discount")),
      code: formData.get("code") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string
    };
    setOffers(offers.map(o => o.id === editingOffer.id ? updatedOffer : o));
    setEditingOffer(null);
    toast({
      title: "Offer Updated",
      description: "Promotional offer has been updated."
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      setOffers(offers.filter(o => o.id !== id));
      toast({
        title: "Offer Deleted",
        description: "The promotional offer has been removed."
      });
    }
  };

  const toggleActive = (id: string) => {
    setOffers(offers.map(o => 
      o.id === id ? { ...o, active: !o.active } : o
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="offers" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Offers & Promotions</h1>
          <p className="text-muted-foreground mt-1">Create and manage promotional campaigns</p>
        </div>

        <div className="mb-6 flex justify-end">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Offer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Offer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddOffer} className="space-y-4">
                <div>
                  <Label htmlFor="title">Offer Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input id="discount" name="discount" type="number" min="1" max="100" required />
                  </div>
                  <div>
                    <Label htmlFor="code">Promo Code</Label>
                    <Input id="code" name="code" required />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" name="endDate" type="date" required />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Offer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-background rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{offer.title}</h3>
                    <Badge className={offer.active ? "bg-green-500" : "bg-gray-500"}>
                      {offer.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{offer.description}</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Discount: </span>
                      <span className="font-semibold text-primary">{offer.discountPercent}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Code: </span>
                      <span className="font-mono font-semibold">{offer.code}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Valid: </span>
                      <span>{offer.startDate} to {offer.endDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(offer.id)}
                  >
                    {offer.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Dialog open={editingOffer?.id === offer.id} onOpenChange={(open) => !open && setEditingOffer(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingOffer(offer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Offer</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditOffer} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-title">Offer Title</Label>
                          <Input id="edit-title" name="title" defaultValue={offer.title} required />
                        </div>
                        <div>
                          <Label htmlFor="edit-description">Description</Label>
                          <Input id="edit-description" name="description" defaultValue={offer.description} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-discount">Discount (%)</Label>
                            <Input id="edit-discount" name="discount" type="number" defaultValue={offer.discountPercent} required />
                          </div>
                          <div>
                            <Label htmlFor="edit-code">Promo Code</Label>
                            <Input id="edit-code" name="code" defaultValue={offer.code} required />
                          </div>
                          <div>
                            <Label htmlFor="edit-startDate">Start Date</Label>
                            <Input id="edit-startDate" name="startDate" type="date" defaultValue={offer.startDate} required />
                          </div>
                          <div>
                            <Label htmlFor="edit-endDate">End Date</Label>
                            <Input id="edit-endDate" name="endDate" type="date" defaultValue={offer.endDate} required />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setEditingOffer(null)}>
                            Cancel
                          </Button>
                          <Button type="submit">Update Offer</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(offer.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminOffers;
