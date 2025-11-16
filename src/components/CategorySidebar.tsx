import { cn } from "@/lib/utils";
import { useState } from "react";

const categories = [
  { id: "all", name: "All Products" },
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home", name: "Home & Garden" },
  { id: "sports", name: "Sports" },
  { id: "beauty", name: "Beauty" },
];

interface CategorySidebarProps {
  onCategoryChange?: (categoryId: string) => void;
}

const CategorySidebar = ({ onCategoryChange }: CategorySidebarProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-card border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "w-full text-left px-4 py-2.5 rounded-lg transition-colors font-medium",
                selectedCategory === category.id
                  ? "bg-categoryActive text-categoryActive-foreground"
                  : "hover:bg-muted"
              )}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default CategorySidebar;
