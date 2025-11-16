import { useState } from "react";
import Header from "@/components/Header";
import CategorySidebar from "@/components/CategorySidebar";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <CategorySidebar onCategoryChange={setSelectedCategory} />
          <ProductGrid categoryFilter={selectedCategory} />
        </div>
      </main>
    </div>
  );
};

export default Index;
