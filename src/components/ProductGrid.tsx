import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "MacBook Pro 14-inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    price: 1999,
    originalPrice: 2199,
    rating: 4.8,
    reviewCount: 1247,
    discount: 9,
    inStock: true,
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    image: "https://images.unsplash.com/photo-1592286927505-1bed5ca1e6e3?w=500&h=500&fit=crop",
    price: 999,
    rating: 4.6,
    reviewCount: 892,
    inStock: true,
  },
  {
    id: 3,
    name: "Premium Running Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    price: 129,
    originalPrice: 159,
    rating: 4.5,
    reviewCount: 456,
    discount: 19,
    inStock: true,
  },
  {
    id: 4,
    name: "Designer Jacket",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    price: 299,
    rating: 4.3,
    reviewCount: 234,
    inStock: false,
  },
  {
    id: 5,
    name: "Modern Coffee Table",
    image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=500&h=500&fit=crop",
    price: 449,
    originalPrice: 599,
    rating: 4.7,
    reviewCount: 167,
    discount: 25,
    inStock: true,
  },
  {
    id: 6,
    name: "Decorative Plants Set",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop",
    price: 89,
    rating: 4.4,
    reviewCount: 89,
    inStock: true,
  },
  {
    id: 7,
    name: "Programming E-Learning Course",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=500&fit=crop",
    price: 79,
    originalPrice: 119,
    rating: 4.9,
    reviewCount: 678,
    discount: 34,
    inStock: true,
  },
  {
    id: 8,
    name: "Online Learning Tablet",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    price: 149,
    rating: 4.6,
    reviewCount: 345,
    inStock: true,
  },
];

interface ProductGridProps {
  categoryFilter?: string;
}

const ProductGrid = ({ categoryFilter = "all" }: ProductGridProps) => {
  const filteredProducts = products; // In a real app, filter based on categoryFilter

  return (
    <div className="flex-1">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">All Products</h2>
        <p className="text-muted-foreground">{filteredProducts.length} products found</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
