import { Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";

interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  discount?: number;
  inStock?: boolean;
}

const ProductCard = ({
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  discount,
  inStock = true,
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount && (
          <Badge className="absolute top-3 left-3 bg-discount text-discount-foreground">
            -{discount}%
          </Badge>
        )}
        {!inStock && (
          <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground">
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-2 line-clamp-1">{name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">₹{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {inStock ? (
          <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        ) : (
          <Button className="w-full gap-2" disabled variant="secondary">
            <ShoppingCart className="h-4 w-4" />
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
