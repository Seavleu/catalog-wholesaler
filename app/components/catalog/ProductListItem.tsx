import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { ProductEntity } from "@/lib/types";

type ProductListItemProps = {
  product: ProductEntity;
  onClick: () => void;
};

export default function ProductListItem({ 
  product, 
  onClick
}: ProductListItemProps) {
  const stockStatus = product.stock_status || 'in_stock';
  const stockStatusMap = {
    'in_stock': { label: 'មានស្តុក', color: 'bg-emerald-500', badge: 'bg-emerald-500/90' },
    'low_stock': { label: 'ស្តុកតិច', color: 'bg-amber-500', badge: 'bg-amber-500/90' },
    'out_of_stock': { label: 'អស់ស្តុក', color: 'bg-red-500', badge: 'bg-red-500/90' },
    'restocking': { label: 'កំពុងបញ្ជាទិញ', color: 'bg-blue-500', badge: 'bg-blue-500/90' },
  };
  const stockStatusDisplay = stockStatusMap[stockStatus as keyof typeof stockStatusMap] || stockStatusMap['in_stock'];

  const displayImage = product.cover_image || product.catalog_images?.[0];

  return (
    <Card 
      className="group overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-3 sm:p-4">
        {/* Image Section */}
        <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {displayImage ? (
            <img 
              src={displayImage} 
              alt={product.name || 'Product image'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
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
          
          {/* Stock Status Badge */}
          {stockStatus !== 'in_stock' && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className={`${stockStatusDisplay.badge} text-white border-0 backdrop-blur-sm text-xs font-medium px-2 py-0.5`}>
                {stockStatusDisplay.label}
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="secondary" className="bg-primary/80 text-primary-foreground border-0 backdrop-blur-sm text-xs font-medium px-2 py-0.5">
                {product.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h3 className="font-semibold text-foreground text-base sm:text-lg leading-tight mb-1">
              {product.name || 'ផលិតផល'}
            </h3>
            {product.brand && (
              <p className="text-sm text-muted-foreground mb-2">
                {product.brand}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {product.color_count && product.color_count > 0 && (
              <span className="text-muted-foreground">
                {product.color_count} {product.color_count === 1 ? 'ពណ៌' : 'ពណ៌'}
              </span>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <span className="text-muted-foreground">
                • {product.sizes.join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

