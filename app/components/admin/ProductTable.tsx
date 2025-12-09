"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Package } from "lucide-react";
import { ProductEntity } from "@/lib/types";

type StockStatusLabel = {
  text: string;
  color: string;
};

type ProductTableProps = {
  products: ProductEntity[];
  onEdit: (product: ProductEntity) => void;
  onDelete: (product: ProductEntity) => void;
  onToggleActive: (product: ProductEntity) => void;
  selectedIds?: string[];
  onSelectionChange: (ids: string[]) => void;
};

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleActive,
  selectedIds = [],
  onSelectionChange,
}: ProductTableProps) {
  const allSelected =
    products.length > 0 && selectedIds.length === products.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < products.length;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(products.map((p) => p.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const getStockStatusLabel = (status?: string): StockStatusLabel => {
    const labels: Record<string, StockStatusLabel> = {
      in_stock: { text: "មានស្តុក", color: "bg-green-100 text-green-700" },
      low_stock: { text: "ស្តុកតិច", color: "bg-yellow-100 text-yellow-700" },
      out_of_stock: { text: "អស់ស្តុក", color: "bg-red-100 text-red-700" },
      restocking: { text: "កំពុងបញ្ជាទិញ", color: "bg-blue-100 text-blue-700" },
    };
    return labels[status || "in_stock"] || labels.in_stock;
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
                className={
                  someSelected ? "data-[state=checked]:bg-muted-foreground" : ""
                }
              />
            </TableHead>
            <TableHead className="w-16">រូបភាព</TableHead>
            <TableHead>ផលិតផល</TableHead>
            <TableHead>ប្រភេទ</TableHead>
            <TableHead className="text-center">ទំហំ/ពណ៌</TableHead>
            <TableHead className="text-center">ស្ថានភាពស្តុក</TableHead>
            <TableHead className="text-center">បង្ហាញ</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className={`hover:bg-muted/50 ${
                selectedIds.includes(product.id) ? "bg-primary/10" : ""
              }`}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={() => toggleOne(product.id)}
                />
              </TableCell>
              <TableCell>
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  {product.cover_image ? (
                    <img
                      src={product.cover_image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{product.category}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  {product.sizes && product.sizes.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {product.sizes.join(", ")}
                    </span>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {product.colors.length} ពណ៌
                    </span>
                  )}
                  {(!product.sizes || product.sizes.length === 0) &&
                    (!product.colors || product.colors.length === 0) && (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {(() => {
                  const status = getStockStatusLabel(product.stock_status);
                  return (
                    <div className="flex flex-col items-center gap-1">
                      <Badge className={status.color}>{status.text}</Badge>
                      {product.restock_date &&
                        (product.stock_status === "out_of_stock" ||
                          product.stock_status === "restocking") && (
                          <span className="text-xs text-muted-foreground">
                            មកដល់:{" "}
                            {new Date(product.restock_date).toLocaleDateString(
                              "km-KH"
                            )}
                          </span>
                        )}
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={
                    product.is_active !== false
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {product.is_active !== false ? "បង្ហាញ" : "លាក់"}
                </Badge>
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                រកមិនឃើញផលិតផល។ បន្ថែមផលិតផលដំបូងដើម្បីចាប់ផ្តើម។
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
