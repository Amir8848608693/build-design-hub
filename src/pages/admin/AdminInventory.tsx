import { useState } from "react";
import { Package, AlertTriangle } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lastUpdated: string;
}

const AdminInventory = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "1", productName: "Sample Product 1", sku: "SKU001", currentStock: 15, minStock: 20, maxStock: 100, lastUpdated: "2024-01-15" },
    { id: "2", productName: "Sample Product 2", sku: "SKU002", currentStock: 85, minStock: 30, maxStock: 150, lastUpdated: "2024-01-14" },
    { id: "3", productName: "Sample Product 3", sku: "SKU003", currentStock: 5, minStock: 10, maxStock: 50, lastUpdated: "2024-01-13" }
  ]);
  const [updatingItem, setUpdatingItem] = useState<InventoryItem | null>(null);

  const handleUpdateStock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!updatingItem) return;
    const formData = new FormData(e.currentTarget);
    const newStock = Number(formData.get("stock"));
    
    setInventory(inventory.map(item => 
      item.id === updatingItem.id 
        ? { ...item, currentStock: newStock, lastUpdated: new Date().toISOString().split('T')[0] }
        : item
    ));
    setUpdatingItem(null);
    toast({
      title: "Stock Updated",
      description: `Stock for ${updatingItem.productName} has been updated.`
    });
  };

  const lowStockItems = inventory.filter(item => item.currentStock < item.minStock);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="inventory" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage stock levels</p>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
              <p className="text-sm text-red-700">
                {lowStockItems.length} product(s) are below minimum stock level
              </p>
            </div>
          </div>
        )}

        <div className="bg-background rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Stock Overview</h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Max Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const isLowStock = item.currentStock < item.minStock;
                const stockPercentage = (item.currentStock / item.maxStock) * 100;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                    <TableCell>
                      <span className={isLowStock ? "text-red-600 font-semibold" : "font-semibold"}>
                        {item.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell>{item.maxStock}</TableCell>
                    <TableCell>
                      <Badge className={
                        isLowStock 
                          ? "bg-red-500 hover:bg-red-600" 
                          : stockPercentage > 70 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-yellow-500 hover:bg-yellow-600"
                      }>
                        {isLowStock ? "Low Stock" : stockPercentage > 70 ? "In Stock" : "Medium"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.lastUpdated}</TableCell>
                    <TableCell>
                      <Dialog open={updatingItem?.id === item.id} onOpenChange={(open) => !open && setUpdatingItem(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setUpdatingItem(item)}
                          >
                            Update Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Stock - {item.productName}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdateStock} className="space-y-4">
                            <div>
                              <Label htmlFor="stock">New Stock Quantity</Label>
                              <Input 
                                id="stock" 
                                name="stock" 
                                type="number" 
                                defaultValue={item.currentStock}
                                min="0"
                                max={item.maxStock}
                                required 
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                Min: {item.minStock} | Max: {item.maxStock}
                              </p>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={() => setUpdatingItem(null)}>
                                Cancel
                              </Button>
                              <Button type="submit">Update</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminInventory;
