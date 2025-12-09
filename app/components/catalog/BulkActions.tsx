"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreVertical, FileSpreadsheet, FileText, X } from "lucide-react";
import { ProductEntity } from "@/lib/types";

type BulkActionsProps = {
  selectedIds: string[];
  products: ProductEntity[];
  onClearSelection: () => void;
};

export default function BulkActions({
  selectedIds,
  products,
  onClearSelection,
}: BulkActionsProps) {
  const hasSelection = selectedIds.length > 0;
  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));

  const exportToCSV = () => {
    const headers = [
      "ឈ្មោះ",
      "ម៉ាក",
      "ប្រភេទ",
      "ទំហំ",
      "ពណ៌",
      "ស្ថានភាពស្តុក",
      "ចំណាំ",
    ];

    const rows = selectedProducts.map((product) => [
      product.name || "",
      product.brand || "",
      product.category || "",
      product.sizes?.join(", ") || "",
      product.colors?.length?.toString() || "0",
      product.stock_status || "in_stock",
      product.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `catalog_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClearSelection();
  };

  const exportToJSON = () => {
    const data = selectedProducts.map((product) => ({
      name: product.name,
      brand: product.brand,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      stock_status: product.stock_status,
      notes: product.notes,
      cover_image: product.cover_image,
      catalog_images: product.catalog_images,
    }));

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `catalog_${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClearSelection();
  };

  if (!hasSelection) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium text-foreground flex-1">
        {selectedIds.length} {selectedIds.length === 1 ? "ផលិតផល" : "ផលិតផល"} ត្រូវបានជ្រើសរើស
      </span>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">ទាញយក</span>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportToCSV}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              ទាញយក CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToJSON}>
              <FileText className="w-4 h-4 mr-2" />
              ទាញយក JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground gap-2"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">លុបការជ្រើសរើស</span>
        </Button>
      </div>
    </div>
  );
}

