import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle } from "lucide-react";
import type { ProductEntity } from "@/lib/base44Api";

type ProductCardProps = {
  product: ProductEntity & {
    style_code?: string;
    stock_quantity?: number;
    image_url?: string;
    additional_images?: string[];
  };
  onClick: () => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const stockQty = product.stock_quantity ?? 0;
  const stockStatus = stockQty === 0 
    ? 'out' 
    : stockQty <= 5 
    ? 'low' 
    : 'available';

  return (
    <Card 
      className="group overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {stockStatus === 'out' && (
            <Badge className="bg-red-500/90 text-white border-0 backdrop-blur-sm">
              Out of Stock
            </Badge>
          )}
          {stockStatus === 'low' && (
            <Badge className="bg-amber-500/90 text-white border-0 backdrop-blur-sm">
              Low Stock
            </Badge>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-black/70 text-white border-0 backdrop-blur-sm text-xs">
            {product.category}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {product.brand}
            </p>
            <h3 className="font-semibold text-gray-900 truncate mt-0.5">
              {product.name}
            </h3>
          </div>
        </div>

        <p className="text-xs text-gray-500 font-mono">
              {product.style_code}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${
              stockStatus === 'available' ? 'bg-emerald-500' :
              stockStatus === 'low' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              {stockQty} in stock
            </span>
          </div>
          
          {(product.colors?.length ?? 0) > 0 && (
            <div className="flex -space-x-1">
              {product.colors?.slice(0, 4).map((color, i) => (
                <div 
                  key={i}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {(product.colors?.length ?? 0) > 4 && (
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center">
                  <span className="text-[8px] text-gray-600">+{(product.colors?.length ?? 0) - 4}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {product.notes && (
          <div className="flex items-center gap-1.5 pt-2">
            <AlertCircle className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-blue-600">{product.notes}</span>
          </div>
        )}
      </div>
    </Card>
  );
}