import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  stock: number;
  image: string;
  discount?: number;
  description: string;
}

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Sample Product 1",
      price: 299,
      oldPrice: 399,
      category: "Electronics",
      stock: 50,
      image: "/placeholder.svg",
      discount: 25,
      description: "High quality product"
    },
    {
      id: "2",
      name: "Sample Product 2",
      price: 199,
      category: "Fashion",
      stock: 120,
      image: "/placeholder.svg",
      description: "Trendy fashion item"
    }
  ]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Product Deleted",
        description: "The product has been removed successfully."
      });
    }
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      oldPrice: formData.get("oldPrice") ? Number(formData.get("oldPrice")) : undefined,
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
      image: formData.get("image") as string || "/placeholder.svg",
      discount: formData.get("discount") ? Number(formData.get("discount")) : undefined,
      description: formData.get("description") as string
    };
    setProducts([...products, newProduct]);
    setIsAddOpen(false);
    toast({
      title: "Product Added",
      description: "New product has been added successfully."
    });
  };

  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    const formData = new FormData(e.currentTarget);
    const updatedProduct: Product = {
      ...editingProduct,
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      oldPrice: formData.get("oldPrice") ? Number(formData.get("oldPrice")) : undefined,
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
      image: formData.get("image") as string || "/placeholder.svg",
      discount: formData.get("discount") ? Number(formData.get("discount")) : undefined,
      description: formData.get("description") as string
    };
    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    toast({
      title: "Product Updated",
      description: "Product has been updated successfully."
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeItem="products" />
      
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>

        <div className="bg-background rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" name="category" required />
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" name="price" type="number" step="0.01" required />
                    </div>
                    <div>
                      <Label htmlFor="oldPrice">Old Price ($)</Label>
                      <Input id="oldPrice" name="oldPrice" type="number" step="0.01" />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input id="stock" name="stock" type="number" required />
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input id="discount" name="discount" type="number" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" name="image" type="url" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" name="description" required />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Product</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    ${product.price}
                    {product.oldPrice && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={product.stock < 20 ? "text-red-600 font-medium" : ""}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{product.discount ? `${product.discount}%` : "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={editingProduct?.id === product.id} onOpenChange={(open) => !open && setEditingProduct(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEditProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="edit-name">Product Name</Label>
                                <Input id="edit-name" name="name" defaultValue={product.name} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-category">Category</Label>
                                <Input id="edit-category" name="category" defaultValue={product.category} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-price">Price ($)</Label>
                                <Input id="edit-price" name="price" type="number" step="0.01" defaultValue={product.price} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-oldPrice">Old Price ($)</Label>
                                <Input id="edit-oldPrice" name="oldPrice" type="number" step="0.01" defaultValue={product.oldPrice} />
                              </div>
                              <div>
                                <Label htmlFor="edit-stock">Stock</Label>
                                <Input id="edit-stock" name="stock" type="number" defaultValue={product.stock} required />
                              </div>
                              <div>
                                <Label htmlFor="edit-discount">Discount (%)</Label>
                                <Input id="edit-discount" name="discount" type="number" defaultValue={product.discount} />
                              </div>
                              <div className="col-span-2">
                                <Label htmlFor="edit-image">Image URL</Label>
                                <Input id="edit-image" name="image" type="url" defaultValue={product.image} />
                              </div>
                              <div className="col-span-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Input id="edit-description" name="description" defaultValue={product.description} required />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                                Cancel
                              </Button>
                              <Button type="submit">Update Product</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
