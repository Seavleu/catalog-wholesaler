"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Plus, Upload, Loader2, Calendar } from "lucide-react";
import { base44, ProductEntity } from "@/app/api/base44Client";

const BRANDS = [
  "Nike",
  "Adidas",
  "Under Armour",
  "Lululemon",
  "The North Face",
  "Patagonia",
  "Kanken",
  "Other",
];
const CATEGORIES = [
  "Men Sportswear",
  "Women Sportswear",
  "Football Jersey",
  "Basketball Jersey",
  "Backpacks",
  "Bags",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
const STOCK_STATUS = [
  { value: "in_stock", label: "មានស្តុក", color: "bg-green-100 text-green-700" },
  {
    value: "low_stock",
    label: "ស្តុកតិច",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "out_of_stock",
    label: "អស់ស្តុក",
    color: "bg-red-100 text-red-700",
  },
  {
    value: "restocking",
    label: "កំពុងបញ្ជាទិញ",
    color: "bg-blue-100 text-blue-700",
  },
];

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'restocking';

type ProductFormData = {
  name: string;
  brand: string;
  category: string;
  cover_image: string;
  catalog_images: string[];
  sizes: string[];
  colors: string[];
  stock_status: StockStatus;
  restock_date: string;
  notes: string;
  is_active: boolean;
};

type ProductFormProps = {
  product: ProductEntity | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProductEntity>) => void;
  isLoading: boolean;
};

export default function ProductForm({
  product,
  open,
  onClose,
  onSave,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    brand: "Nike",
    category: "Men Sportswear",
    cover_image: "",
    catalog_images: [],
    sizes: [],
    colors: [],
    stock_status: "in_stock",
    restock_date: "",
    notes: "",
    is_active: true,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "Nike",
        category: product.category || "Men Sportswear",
        cover_image: product.cover_image || "",
        catalog_images: product.catalog_images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock_status: product.stock_status || "in_stock",
        restock_date: product.restock_date || "",
        notes: product.notes || "",
        is_active: product.is_active !== false,
      });
    } else {
      setFormData({
        name: "",
        brand: "Nike",
        category: "Men Sportswear",
        cover_image: "",
        catalog_images: [],
        sizes: [],
        colors: [],
        stock_status: "in_stock",
        restock_date: "",
        notes: "",
        is_active: true,
      });
    }
  }, [product, open]);

  const handleChange = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange("cover_image", file_url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  const handleCatalogUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({
          file,
        });
        uploadedUrls.push(file_url);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
    setFormData((prev) => ({
      ...prev,
      catalog_images: [...(prev.catalog_images || []), ...uploadedUrls],
    }));
    setUploading(false);
  };

  const removeCatalogImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      catalog_images: prev.catalog_images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = (e.target as HTMLInputElement).value.trim();
      if (val && !formData.colors?.includes(val)) {
        handleChange("colors", [...(formData.colors || []), val]);
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "កែសម្រួលផលិតផល" : "បន្ថែមផលិតផលថ្មី"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>ឈ្មោះផលិតផល *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Nike Dri-FIT Training Shirt"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ម៉ាក *</Label>
              <Select
                value={formData.brand}
                onValueChange={(v) => handleChange("brand", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ប្រភេទ *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>រូបភាពគម្រប</Label>
            <div className="flex gap-4 items-start">
              {formData.cover_image ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.cover_image}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleChange("cover_image", "")}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                  {uploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400" />
                  )}
                </label>
              )}
              <Input
                value={formData.cover_image}
                onChange={(e) => handleChange("cover_image", e.target.value)}
                placeholder="ឬបិទភ្ជាប់ URL រូបភាព"
                className="flex-1"
              />
            </div>
          </div>

          {/* Catalog Images */}
          <div className="space-y-2">
            <Label>រូបភាពកាតាឡុក</Label>
            <p className="text-sm text-gray-500">
              បង្ហោះរូបភាពច្រើនដើម្បីបង្ហាញពណ៌ផ្សេងៗ
            </p>
            <div className="flex gap-2 flex-wrap">
              {formData.catalog_images?.map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={img}
                    alt={`Catalog ${i}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeCatalogImage(i)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleCatalogUpload}
                />
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400" />
                )}
              </label>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>ទំហំដែលមាន</Label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    const current = formData.sizes || [];
                    if (current.includes(size)) {
                      handleChange(
                        "sizes",
                        current.filter((s) => s !== size)
                      );
                    } else {
                      handleChange("sizes", [...current, size]);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg border text-base font-medium transition-colors ${
                    formData.sizes?.includes(size)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>ពណ៌ដែលមាន</Label>
            <div className="flex flex-wrap gap-2">
              {(formData.colors || []).map((color, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 rounded-lg text-base flex items-center gap-2"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        "colors",
                        formData.colors.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </span>
              ))}
              <Input
                placeholder="បន្ថែមពណ៌ថ្មី (Enter)"
                className="w-40 h-10"
                onKeyDown={handleColorKeyDown}
              />
            </div>
          </div>

          {/* Stock Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ស្ថានភាពស្តុក</Label>
              <Select
                value={formData.stock_status || "in_stock"}
                onValueChange={(v) => handleChange("stock_status", v as StockStatus)}
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(formData.stock_status === "out_of_stock" ||
              formData.stock_status === "restocking") && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  កាលបរិច្ឆេទមកដល់ប៉ាន់ស្មាន
                </Label>
                <Input
                  type="date"
                  value={formData.restock_date || ""}
                  onChange={(e) => handleChange("restock_date", e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>កំណត់ចំណាំ</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="ព័ត៌មានសម្រាប់ទំនាក់ទំនង, MOQ, etc."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            បោះបង់
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.name || !formData.brand}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {product ? "រក្សាទុក" : "បង្កើត"} ផលិតផល
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
