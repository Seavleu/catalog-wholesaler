"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, Loader2 } from "lucide-react";
import ProductTable from "@/app/components/admin/ProductTable";
import ProductForm from "@/app/components/admin/ProductForm";
import UserManagement from "@/app/components/admin/UserManagement";
import { app, ProductEntity } from "@/app/api/appClient";
import { useToast } from "@/components/ui/toast";

export default function AdminPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductEntity | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await app.entities.Product.list();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
    setLoading(false);
  };

  const handleSave = async (formData: Partial<ProductEntity>) => {
    setSaving(true);
    try {
      const isEdit = !!editProduct?.id;
      if (isEdit) {
        await app.entities.Product.update(editProduct.id, formData);
        showToast("ផលិតផលត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ", "success");
      } else {
        await app.entities.Product.create(formData);
        showToast("ផលិតផលត្រូវបានបង្កើតដោយជោគជ័យ", "success");
      }
      await loadProducts();
      // Auto-close form after successful save
      setShowForm(false);
      setEditProduct(null);
    } catch (err: any) {
      console.error("Failed to save product:", err);
      showToast(
        err?.message || "មានបញ្ហាក្នុងការរក្សាទុកផលិតផល",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: ProductEntity) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (product: ProductEntity) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await app.entities.Product.delete(product.id);
      showToast("ផលិតផលត្រូវបានលុបដោយជោគជ័យ", "success");
      await loadProducts();
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      showToast(
        err?.message || "មានបញ្ហាក្នុងការលុបផលិតផល",
        "error"
      );
    }
  };

  const handleToggleActive = async (product: ProductEntity) => {
    try {
      const newStatus = !product.is_active;
      await app.entities.Product.update(product.id, {
        is_active: newStatus,
      });
      showToast(
        newStatus
          ? "ផលិតផលត្រូវបានបើកដោយជោគជ័យ"
          : "ផលិតផលត្រូវបានបិទដោយជោគជ័យ",
        "success"
      );
      await loadProducts();
    } catch (err: any) {
      console.error("Failed to toggle product:", err);
      showToast(
        err?.message || "មានបញ្ហាក្នុងការផ្លាស់ប្តូរស្ថានភាព",
        "error"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">គ្រប់គ្រង</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">គ្រប់គ្រងផលិតផល និងអ្នកប្រើប្រាស់</p>
      </div>

      <Tabs defaultValue="products" className="space-y-4 sm:space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-lg sm:rounded-xl w-full sm:w-auto">
          <TabsTrigger
            value="products"
            className="gap-1 sm:gap-2 data-[state=active]:bg-white rounded-md sm:rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 sm:flex-initial"
          >
            <Package className="w-4 h-4" />
            <span className="whitespace-nowrap">ផលិតផល</span>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="gap-1 sm:gap-2 data-[state=active]:bg-white rounded-md sm:rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 sm:flex-initial"
          >
            <Users className="w-4 h-4" />
            <span className="whitespace-nowrap">អ្នកប្រើប្រាស់</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditProduct(null);
                setShowForm(true);
              }}
              className="gap-2 w-full sm:w-auto h-11 sm:h-10 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              បន្ថែមផលិតផល
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          )}

          <ProductForm
            product={editProduct}
            open={showForm}
            onClose={() => {
              setShowForm(false);
              setEditProduct(null);
            }}
            onSave={handleSave}
            isLoading={saving}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
