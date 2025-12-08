import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle } from "lucide-react";
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
      className="group overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
                    <svg class="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
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
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="bg-black/70 text-white border-0 backdrop-blur-sm text-xs font-medium px-2 py-0.5">
              {product.category}
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col space-y-2">
        {/* Brand and Name */}
        <div className="flex-1">
          {product.brand && (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name || 'ផលិតផល'}
          </h3>
        </div>

        {/* Color Count */}
        {product.color_count && product.color_count > 0 && (
          <p className="text-xs text-gray-500">
            {product.color_count} {product.color_count === 1 ? 'ពណ៌' : 'ពណ៌'}
          </p>
        )}

        {/* Stock Status and Colors */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {/* Stock Status Indicator */}
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${stockStatusDisplay.color} flex-shrink-0`} />
            <span className="text-xs font-medium text-gray-700">
              {stockStatusDisplay.label}
            </span>
          </div>
          
          {/* Color Swatches */}
          {(product.colors?.length ?? 0) > 0 && (
            <div className="flex -space-x-1 flex-shrink-0">
              {product.colors?.slice(0, 4).map((color, i) => {
                // Try to parse color as hex/rgb, otherwise use as-is
                const colorValue = color.toLowerCase().trim();
                const isValidColor = /^#[0-9A-F]{6}$/i.test(colorValue) || 
                                   /^rgb\(/i.test(colorValue) || 
                                   /^[a-z]+$/i.test(colorValue);
                
                return (
                  <div 
                    key={i}
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={isValidColor ? { backgroundColor: colorValue } : { backgroundColor: '#ccc' }}
                    title={color}
                  />
                );
              })}
              {(product.colors?.length ?? 0) > 4 && (
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center">
                  <span className="text-[8px] text-gray-600 font-semibold">+{(product.colors?.length ?? 0) - 4}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        {product.notes && (
          <div className="flex items-start gap-1.5 pt-2 border-t border-gray-100">
            <AlertCircle className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-blue-600 line-clamp-2">{product.notes}</span>
          </div>
        )}
      </div>
    </Card>
  );
}