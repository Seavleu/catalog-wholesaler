import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, Tag, Palette, Ruler, AlertCircle } from "lucide-react";
import type { ProductEntity } from "@/lib/base44Api";

type DetailProduct = ProductEntity & {
  style_code?: string;
  stock_quantity?: number;
  image_url?: string;
  additional_images?: string[];
};

type ProductDetailModalProps = {
  product: DetailProduct | null;
  open: boolean;
  onClose: () => void;
};

export default function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  const stockQty = product.stock_quantity ?? 0;
  const stockStatus = stockQty === 0 
    ? 'out' 
    : stockQty <= 5 
    ? 'low' 
    : 'available';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-gray-300" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-black text-white">{product.brand}</Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-4 h-4" />
                <span className="text-sm">Style: <span className="font-mono font-medium text-gray-900">{product.style_code}</span></span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  stockStatus === 'available' ? 'bg-emerald-500' :
                  stockStatus === 'low' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span className="font-semibold text-lg">
                  {stockQty} units available
                </span>
              </div>
            </div>

            {product.sizes?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Ruler className="w-4 h-4" />
                  <span>Available Sizes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, i) => (
                    <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Palette className="w-4 h-4" />
                  <span>Colors</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="text-xs text-gray-700">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.notes && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-sm text-blue-700">{product.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Images */}
        {product.additional_images?.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">More Images</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.additional_images.map((img, i) => (
                <img 
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 2}`}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}