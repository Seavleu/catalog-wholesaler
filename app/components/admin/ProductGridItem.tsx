import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ProductEntity } from "@/lib/types";

type ProductGridItemProps = {
  product: ProductEntity;
  onEdit: (product: ProductEntity) => void;
  onDelete: (product: ProductEntity) => void;
  onToggleActive: (product: ProductEntity) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export default function ProductGridItem({
  product,
  onEdit,
  onDelete,
  onToggleActive,
  isSelected,
  onSelect,
}: ProductGridItemProps) {
  const getStockStatusLabel = (status?: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      in_stock: { text: "មានស្តុក", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
      low_stock: { text: "ស្តុកតិច", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
      out_of_stock: { text: "អស់ស្តុក", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
      restocking: { text: "កំពុងបញ្ជាទិញ", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    };
    return labels[status || "in_stock"] || labels.in_stock;
  };

  const status = getStockStatusLabel(product.stock_status);

  return (
    <Card className={`overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <div className="p-4 space-y-3">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-muted rounded-lg">
          {product.cover_image ? (
            <img
              src={product.cover_image}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                console.error('Image failed to load:', product.cover_image);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={status.color}>{status.text}</Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-foreground text-sm line-clamp-1">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            <Badge
              className={
                product.is_active !== false
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  : "bg-muted text-muted-foreground"
              }
            >
              {product.is_active !== false ? "បង្ហាញ" : "លាក់"}
            </Badge>
          </div>

          {/* Sizes/Colors */}
          <div className="text-xs text-muted-foreground space-y-1">
            {product.sizes && product.sizes.length > 0 && (
              <p>ទំហំ: {product.sizes.join(", ")}</p>
            )}
            {product.colors && product.colors.length > 0 && (
              <p>{product.colors.length} ពណ៌</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(product.id)}
              className="w-4 h-4 rounded border-border"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  កែសម្រួល
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleActive(product)}>
                  {product.is_active !== false ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      លាក់
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      បង្ហាញ
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(product)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  លុប
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}

