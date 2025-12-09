"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductTable from "@/app/components/admin/ProductTable";
import ProductForm from "@/app/components/admin/ProductForm";
import BulkActions from "@/app/components/admin/BulkActions";
import UserManagement from "@/app/components/admin/UserManagement";
import { app, ProductEntity } from "@/app/api/appClient";
import { useToast } from "@/components/ui/toast";
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

export default function AdminPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductEntity | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteProduct, setDeleteProduct] = useState<ProductEntity | null>(null);
  const [toggleProduct, setToggleProduct] = useState<ProductEntity | null>(null);
  const [toggleAction, setToggleAction] = useState<"activate" | "deactivate" | null>(null);

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

  const handleDelete = (product: ProductEntity) => {
    setDeleteProduct(product);
  };

  const confirmDelete = async () => {
    if (!deleteProduct) return;
    try {
      await app.entities.Product.delete(deleteProduct.id);
      showToast("ផលិតផលត្រូវបានលុបដោយជោគជ័យ", "success");
      await loadProducts();
      setDeleteProduct(null);
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      showToast(
        err?.message || "មានបញ្ហាក្នុងការលុបផលិតផល",
        "error"
      );
      setDeleteProduct(null);
    }
  };

  const handleToggleActive = (product: ProductEntity) => {
    setToggleProduct(product);
    setToggleAction(product.is_active !== false ? "deactivate" : "activate");
  };

  const confirmToggleActive = async () => {
    if (!toggleProduct || !toggleAction) return;
    try {
      const newStatus = toggleAction === "activate";
      await app.entities.Product.update(toggleProduct.id, {
        is_active: newStatus,
      });
      showToast(
        newStatus
          ? "ផលិតផលត្រូវបានបើកដោយជោគជ័យ"
          : "ផលិតផលត្រូវបានបិទដោយជោគជ័យ",
        "success"
      );
      await loadProducts();
      setToggleProduct(null);
      setToggleAction(null);
    } catch (err: any) {
      console.error("Failed to toggle product:", err);
      showToast(
        err?.message || "មានបញ្ហាក្នុងការផ្លាស់ប្តូរស្ថានភាព",
        "error"
      );
      setToggleProduct(null);
      setToggleAction(null);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => app.entities.Product.delete(id)));
      showToast(
        `${ids.length} ${ids.length === 1 ? "ផលិតផល" : "ផលិតផល"} ត្រូវបានលុបដោយជោគជ័យ`,
        "success"
      );
      await loadProducts();
    } catch (err: any) {
      console.error("Failed to bulk delete:", err);
      showToast(
        err?.message || "មានបញ្ហាក្នុងការលុបផលិតផល",
        "error"
      );
    }
  };

  const handleBulkActivate = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map((id) => app.entities.Product.update(id, { is_active: true }))
      );
      showToast(
        `${ids.length} ${ids.length === 1 ? "ផលិតផល" : "ផលិតផល"} ត្រូវបានបើកដោយជោគជ័យ`,
        "success"
      );
      await loadProducts();
    } catch (err: any) {
      console.error("Failed to bulk activate:", err);
      showToast(
        err?.message || "មានបញ្ហាក្នុងការផ្លាស់ប្តូរស្ថានភាព",
        "error"
      );
    }
  };

  const handleBulkDeactivate = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map((id) => app.entities.Product.update(id, { is_active: false }))
      );
      showToast(
        `${ids.length} ${ids.length === 1 ? "ផលិតផល" : "ផលិតផល"} ត្រូវបានបិទដោយជោគជ័យ`,
        "success"
      );
      await loadProducts();
    } catch (err: any) {
      console.error("Failed to bulk deactivate:", err);
      showToast(
        err?.message || "មានបញ្ហាក្នុងការផ្លាស់ប្តូរស្ថានភាព",
        "error"
      );
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const name = (product.name || "").toLowerCase();
    const brand = (product.brand || "").toLowerCase();
    const category = (product.category || "").toLowerCase();
    const notes = (product.notes || "").toLowerCase();
    
    return (
      name.includes(query) ||
      brand.includes(query) ||
      category.includes(query) ||
      notes.includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">គ្រប់គ្រង</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">គ្រប់គ្រងផលិតផល និងអ្នកប្រើប្រាស់</p>
      </div>

      <Tabs defaultValue="products" className="space-y-4 sm:space-y-6">
        <TabsList className="bg-muted p-1 rounded-lg sm:rounded-xl w-full sm:w-auto">
          <TabsTrigger
            value="products"
            className="gap-1 sm:gap-2 data-[state=active]:bg-background rounded-md sm:rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 sm:flex-initial"
          >
            <Package className="w-4 h-4" />
            <span className="whitespace-nowrap">ផលិតផល</span>
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="gap-1 sm:gap-2 data-[state=active]:bg-background rounded-md sm:rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base flex-1 sm:flex-initial"
          >
            <Users className="w-4 h-4" />
            <span className="whitespace-nowrap">អ្នកប្រើប្រាស់</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Bar */}
            {!loading && (
              <div className="relative flex-1 sm:max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ស្វែងរកផលិតផលតាមឈ្មោះ, ម៉ាក, ប្រភេទ, ឬចំណាំ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
                    title="លុប"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            )}
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
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {searchQuery && filteredProducts.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  រកឃើញ {filteredProducts.length} {filteredProducts.length === 1 ? 'ផលិតផល' : 'ផលិតផល'} ដែលត្រូវនឹង "{searchQuery}"
                </p>
              )}
              <BulkActions
                selectedIds={selectedIds}
                products={filteredProducts}
                onBulkDelete={handleBulkDelete}
                onBulkActivate={handleBulkActivate}
                onBulkDeactivate={handleBulkDeactivate}
                onClearSelection={() => setSelectedIds([])}
              />
              <ProductTable
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
              {!loading && searchQuery && filteredProducts.length === 0 && (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      រកមិនឃើញផលិតផលដែលត្រូវនឹង "{searchQuery}"
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      លុបតម្រង
                    </Button>
                  </div>
                </div>
              )}
            </>
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

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>លុបផលិតផល</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  តើអ្នកប្រាកដថាចង់លុបផលិតផល &quot;{deleteProduct?.name}&quot; នេះទេ?
                  <br />
                  <span className="text-red-600 font-semibold">
                    សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ រូបភាពទាំងអស់នឹងត្រូវបានលុបផងដែរ។
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-12 text-base px-6">
                  បោះបង់
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 h-12 text-base px-6"
                >
                  លុប
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Toggle Active Confirmation Dialog */}
          <AlertDialog open={!!toggleProduct} onOpenChange={() => {
            setToggleProduct(null);
            setToggleAction(null);
          }}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {toggleAction === "activate" ? "បើកផលិតផល" : "បិទផលិតផល"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  {toggleAction === "activate" ? (
                    <>
                      តើអ្នកប្រាកដថាចង់បើកផលិតផល &quot;{toggleProduct?.name}&quot; ដើម្បីបង្ហាញក្នុងកាតាឡុកទេ?
                    </>
                  ) : (
                    <>
                      តើអ្នកប្រាកដថាចង់បិទផលិតផល &quot;{toggleProduct?.name}&quot; ដើម្បីលាក់ពីកាតាឡុកទេ?
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="h-12 text-base px-6"
                  onClick={() => {
                    setToggleProduct(null);
                    setToggleAction(null);
                  }}
                >
                  បោះបង់
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmToggleActive}
                  className="h-12 text-base px-6"
                >
                  {toggleAction === "activate" ? "បើក" : "បិទ"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
