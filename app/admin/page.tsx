"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, Loader2 } from "lucide-react";
import ProductTable from "@/app/components/admin/ProductTable";
import ProductForm from "@/app/components/admin/ProductForm";
import UserManagement from "@/app/components/admin/UserManagement";
import { base44, ProductEntity } from "@/app/api/base44Client";

export default function AdminPage() {
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
      const data = await base44.entities.Product.list();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
    setLoading(false);
  };

  const handleSave = async (formData: Partial<ProductEntity>) => {
    setSaving(true);
    try {
      if (editProduct?.id) {
        await base44.entities.Product.update(editProduct.id, formData);
      } else {
        await base44.entities.Product.create(formData);
      }
      await loadProducts();
      setShowForm(false);
      setEditProduct(null);
    } catch (err) {
      console.error("Failed to save product:", err);
    }
    setSaving(false);
  };

  const handleEdit = (product: ProductEntity) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (product: ProductEntity) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await base44.entities.Product.delete(product.id);
      await loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleToggleActive = async (product: ProductEntity) => {
    try {
      await base44.entities.Product.update(product.id, {
        is_active: !product.is_active,
      });
      await loadProducts();
    } catch (err) {
      console.error("Failed to toggle product:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">គ្រប់គ្រង</h1>
          <p className="text-gray-600 mt-1">គ្រប់គ្រងផលិតផល និងអ្នកប្រើប្រាស់</p>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-xl">
          <TabsTrigger
            value="products"
            className="gap-2 data-[state=active]:bg-white rounded-lg px-4 py-2"
          >
            <Package className="w-4 h-4" />
            ផលិតផល
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="gap-2 data-[state=active]:bg-white rounded-lg px-4 py-2"
          >
            <Users className="w-4 h-4" />
            អ្នកប្រើប្រាស់
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditProduct(null);
                setShowForm(true);
              }}
              className="gap-2"
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
