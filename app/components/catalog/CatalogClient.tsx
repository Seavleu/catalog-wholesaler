"use client";

import React, { useMemo, useState } from "react";
import CatalogFilters from "@/app/components/catalog/CatalogFilters";
import ProductCard from "@/app/components/catalog/ProductCard";
import QuickViewModal from "@/app/components/catalog/QuickViewModal";
import { ProductEntity } from "@/lib/types";
import { Camera, Send, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

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
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      // Filter out inactive products
      if (p.is_active === false) return false;
      
      // Category filter
      if (selectedCategory !== "All" && p.category !== selectedCategory) {
        return false;
      }
      
      // Brand filter
      if (selectedBrand !== "All" && p.brand !== selectedBrand) {
        return false;
      }
      
      // Search filter - search in name, brand, category, and notes
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.notes?.toLowerCase().includes(q);
        
        if (!matchesSearch) return false;
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <header className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            កាតាឡុកផលិតផល
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            រុករកផលិតផលកីឡាទាំងអស់របស់យើង
          </p>
          {visibleProducts.length > 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              រកឃើញ {visibleProducts.length} {visibleProducts.length === 1 ? 'ផលិតផល' : 'ផលិតផល'}
            </p>
          )}
        </header>

        {/* Telegram Instructions Banner - Toggleable */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
            className="w-full flex items-center justify-between gap-3 p-3 sm:p-4 hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-foreground text-sm sm:text-base">
                  ចង់បញ្ជាទិញផលិតផល?
                </h3>
                {!isInstructionsOpen && (
                  <p className="text-muted-foreground text-xs sm:text-sm truncate">
                    សូមថតរូបផលិតផលដែលអ្នកចង់បញ្ជាទិញ និងផ្ញើមកកាន់ Telegram
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isInstructionsOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>
          
          {isInstructionsOpen && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 md:pb-5 pt-0 border-t border-primary/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                <div className="flex-1 w-full">
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-0">
                    សូមថតរូបផលិតផលដែលអ្នកចង់បញ្ជាទិញ និងផ្ញើមកកាន់ Telegram របស់យើង
                  </p>
                </div>
                <a
                  href="https://t.me/your_telegram_username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>ផ្ញើទៅ Telegram</span>
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border p-3 sm:p-4 md:p-6">
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
        </div>

        {/* Products Grid */}
      {visibleProducts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl shadow-sm border border-border">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  រកមិនឃើញផលិតផល
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  សូមសាកល្បងប្រអប់តម្រងស្វែងរកផ្សេង ឬលុបតម្រងដើម្បីមើលផលិតផលទាំងអស់
                </p>
                {(searchQuery || selectedCategory !== "All" || selectedBrand !== "All") && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    លុបតម្រងទាំងអស់
                  </button>
                )}
              </div>
            </div>
        </div>
            ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                 {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => openQuickView(product)}
            />
          ))}
        </div>
      )}
      </div>

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

