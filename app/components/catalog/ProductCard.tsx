import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { ProductEntity } from "@/lib/types";

type ProductCardProps = {
  product: ProductEntity;
  onClick: () => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  // Map stock_status to display - using only ProductEntity fields
  const stockStatus = product.stock_status || 'in_stock';
  const stockStatusMap = {
    'in_stock': { label: 'មានស្តុក', color: 'bg-emerald-500', badge: 'bg-emerald-500/90' },
    'low_stock': { label: 'ស្តុកតិច', color: 'bg-amber-500', badge: 'bg-amber-500/90' },
    'out_of_stock': { label: 'អស់ស្តុក', color: 'bg-red-500', badge: 'bg-red-500/90' },
    'restocking': { label: 'កំពុងបញ្ជាទិញ', color: 'bg-blue-500', badge: 'bg-blue-500/90' },
  };
  const stockStatusDisplay = stockStatusMap[stockStatus as keyof typeof stockStatusMap] || stockStatusMap['in_stock'];

  // Use cover_image from ProductEntity, fallback to first catalog_image if no cover_image
  const displayImage = product.cover_image || product.catalog_images?.[0];

  return (
    <Card 
      className="group overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={product.name || 'Product image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center">
                    <svg class="w-16 h-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Stock Status Badge - Show for all statuses except in_stock */}
        {stockStatus !== 'in_stock' && (
          <div className="absolute top-2 right-2 z-10">
            <Badge className={`${stockStatusDisplay.badge} text-white border-0 backdrop-blur-sm text-xs font-medium px-2 py-0.5`}>
              {stockStatusDisplay.label}
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-1.5 left-1.5 z-10 max-w-[40%] sm:max-w-[45%]">
            <Badge variant="secondary" className="bg-primary/80 text-primary-foreground border-0 backdrop-blur-sm text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 truncate block">
              {product.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section - Minimal */}
      <div className="px-2 py-1.5 space-y-0.5">
        <h3 className="font-medium text-foreground text-xs leading-tight line-clamp-1 truncate">
          {product.name || 'ផលិតផល'}
        </h3>
        {product.color_count && product.color_count > 0 && (
          <p className="text-[10px] text-muted-foreground">
            {product.color_count} {product.color_count === 1 ? 'ពណ៌' : 'ពណ៌'}
          </p>
        )}
      </div>
    </Card>
  );
}