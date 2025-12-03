"use client";

import React, { useMemo, useState } from "react";
import CatalogFilters from "@/app/components/catalog/CatalogFilters";
import ProductCard from "@/app/components/catalog/ProductCard";
import QuickViewModal from "@/app/components/catalog/QuickViewModal";
import { ProductEntity } from "@/lib/base44Api";

type CatalogClientProps = {
  initialProducts: ProductEntity[];
  brands: string[];
};

export default function CatalogClient({ initialProducts, brands }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState<ProductEntity | null>(null);
  const [quickViewIndex, setQuickViewIndex] = useState(0);

  const visibleProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      if (p.is_active === false) return false;
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedBrand !== "All" && p.brand !== selectedBrand) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [initialProducts, searchQuery, selectedCategory, selectedBrand]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
  };

  const openQuickView = (product: ProductEntity) => {
    const index = visibleProducts.findIndex((p) => p.id === product.id);
    setQuickViewIndex(index >= 0 ? index : 0);
    setQuickViewProduct(product);
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, quickViewIndex - 1);
    setQuickViewIndex(newIndex);
    setQuickViewProduct(visibleProducts[newIndex] ?? null);
  };

  const handleNext = () => {
    const newIndex = Math.min(visibleProducts.length - 1, quickViewIndex + 1);
    setQuickViewIndex(newIndex);
    setQuickViewProduct(visibleProducts[newIndex] ?? null);
  };

  const hasPrevious = quickViewIndex > 0;
  const hasNext = quickViewIndex < visibleProducts.length - 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">កាតាឡុក</h1>
        <p className="text-gray-600 text-sm">
          រុករកផលិតផលកីឡាទាំងអស់។
        </p>
      </header>

      <CatalogFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brands={brands}
        onClear={handleClearFilters}
      />

      {visibleProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">រកមិនឃើញផលិតផល។ សូមសាកល្បងតម្រងផ្សេង។</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => openQuickView(product)}
            />
          ))}
        </div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
      />
    </div>
  );
}

