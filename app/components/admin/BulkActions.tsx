"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Download,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { ProductEntity } from "@/lib/types";

type BulkActionsProps = {
  selectedIds: string[];
  products: ProductEntity[];
  onBulkDelete: (ids: string[]) => void;
  onBulkActivate: (ids: string[]) => void;
  onBulkDeactivate: (ids: string[]) => void;
  onClearSelection: () => void;
};

export default function BulkActions({
  selectedIds,
  products,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onClearSelection,
}: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const hasSelection = selectedIds.length > 0;

  const handleBulkDelete = async () => {
    setIsProcessing(true);
    try {
      await onBulkDelete(selectedIds);
      setShowDeleteDialog(false);
      onClearSelection();
    } catch (err) {
      console.error("Bulk delete failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkActivate = () => {
    setShowActivateDialog(true);
  };

  const confirmBulkActivate = async () => {
    setIsProcessing(true);
    try {
      await onBulkActivate(selectedIds);
      setShowActivateDialog(false);
      onClearSelection();
    } catch (err) {
      console.error("Bulk activate failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDeactivate = () => {
    setShowDeactivateDialog(true);
  };

  const confirmBulkDeactivate = async () => {
    setIsProcessing(true);
    try {
      await onBulkDeactivate(selectedIds);
      setShowDeactivateDialog(false);
      onClearSelection();
    } catch (err) {
      console.error("Bulk deactivate failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ឈ្មោះ",
      "ម៉ាក",
      "ប្រភេទ",
      "ទំហំ",
      "ពណ៌",
      "ស្ថានភាពស្តុក",
      "បង្ហាញ",
      "ចំណាំ",
    ];

    const rows = selectedProducts.map((product) => [
      product.name || "",
      product.brand || "",
      product.category || "",
      product.sizes?.join(", ") || "",
      product.colors?.length?.toString() || "0",
      product.stock_status || "in_stock",
      product.is_active !== false ? "បង្ហាញ" : "លាក់",
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
    link.setAttribute("download", `products_${new Date().toISOString().split("T")[0]}.csv`);
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
      is_active: product.is_active,
      notes: product.notes,
      cover_image: product.cover_image,
    }));

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `products_${new Date().toISOString().split("T")[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClearSelection();
  };

  if (!hasSelection) return null;

  return (
    <>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <MoreVertical className="w-4 h-4" />
                <span className="hidden sm:inline">សកម្មភាព</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBulkActivate}>
                <Eye className="w-4 h-4 mr-2" />
                បើកទាំងអស់
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBulkDeactivate}>
                <EyeOff className="w-4 h-4 mr-2" />
                បិទទាំងអស់
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                លុបទាំងអស់
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground"
          >
            លុបការជ្រើសរើស
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>លុបផលិតផលជាក្រុម</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              តើអ្នកប្រាកដថាចង់លុប {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "ផលិតផល" : "ផលិតផល"} នេះទេ?
              <br />
              <span className="text-red-600 font-semibold">
                សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ រូបភាពទាំងអស់នឹងត្រូវបានលុបផងដែរ។
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="h-12 text-base px-6">
              បោះបង់
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 h-12 text-base px-6"
            >
              {isProcessing ? "កំពុងលុប..." : "លុប"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Confirmation Dialog */}
      <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>បើកផលិតផលជាក្រុម</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              តើអ្នកប្រាកដថាចង់បើក {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "ផលិតផល" : "ផលិតផល"} ដើម្បីបង្ហាញក្នុងកាតាឡុកទេ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="h-12 text-base px-6">
              បោះបង់
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkActivate}
              disabled={isProcessing}
              className="h-12 text-base px-6"
            >
              {isProcessing ? "កំពុងបើក..." : "បើក"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>បិទផលិតផលជាក្រុម</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              តើអ្នកប្រាកដថាចង់បិទ {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "ផលិតផល" : "ផលិតផល"} ដើម្បីលាក់ពីកាតាឡុកទេ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="h-12 text-base px-6">
              បោះបង់
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDeactivate}
              disabled={isProcessing}
              className="h-12 text-base px-6"
            >
              {isProcessing ? "កំពុងបិទ..." : "បិទ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

