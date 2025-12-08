"use client";

import React, { useMemo, useState } from "react";
import CatalogFilters from "@/app/components/catalog/CatalogFilters";
import ProductCard from "@/app/components/catalog/ProductCard";
import QuickViewModal from "@/app/components/catalog/QuickViewModal";
import { ProductEntity } from "@/lib/types";
import { Camera, Send, MessageCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <header className="space-y-3 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            កាតាឡុកផលិតផល
          </h1>
          <p className="text-gray-600 text-base">
            រុករកផលិតផលកីឡាទាំងអស់របស់យើង
        </p>
          {visibleProducts.length > 0 && (
            <p className="text-sm text-gray-500">
              រកឃើញ {visibleProducts.length} {visibleProducts.length === 1 ? 'ផលិតផល' : 'ផលិតផល'}
            </p>
          )}
      </header>

        {/* Telegram Instructions Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                  ចង់បញ្ជាទិញផលិតផល?
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm">
                  សូមថតរូបផលិតផលដែលអ្នកចង់បញ្ជាទិញ និងផ្ញើមកកាន់ Telegram របស់យើង
                </p>
              </div>
            </div>
            <a
              href="https://t.me/your_telegram_username"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ផ្ញើទៅ Telegram</span>
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
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
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  រកមិនឃើញផលិតផល
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  សូមសាកល្បងតម្រងផ្សេង ឬលុបតម្រងដើម្បីមើលផលិតផលទាំងអស់
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
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

