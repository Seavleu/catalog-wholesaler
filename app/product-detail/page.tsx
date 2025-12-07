"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ArrowLeft,
  Loader2,
  Ruler,
  Palette,
  AlertCircle,
} from "lucide-react";
import { base44, ProductEntity } from "@/app/api/base44Client";
import RelatedProducts from "@/app/components/catalog/RelatedProducts";
import ImageMagnifier from "@/app/components/catalog/ImageMagnifier";

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<ProductEntity | null>(null);
  const [allProducts, setAllProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [magnifierOpen, setMagnifierOpen] = useState(false);
  const [magnifierIndex, setMagnifierIndex] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const products = await base44.entities.Product.list();
        setAllProducts(products);
        const found = products.find((p) => p.id === productId);
        setProduct(found || null);
      } catch (err) {
        console.error("Failed to load product:", err);
      }
      setLoading(false);
    }
    if (productId) {
      load();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          រកមិនឃើញផលិតផល
        </h1>
        <p className="text-gray-600 mb-6">
          ផលិតផលដែលអ្នកកំពុងស្វែងរកមិនមានទេ។
        </p>
        <Link href="/catalog">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            ត្រឡប់ទៅកាតាឡុក
          </Button>
        </Link>
      </div>
    );
  }

  const allImages = [
    product.cover_image,
    ...(product.catalog_images || []),
  ].filter(Boolean) as string[];

  const stockLabel = {
    in_stock: { text: "មានស្តុក", color: "bg-green-100 text-green-700" },
    low_stock: { text: "ស្តុកតិច", color: "bg-yellow-100 text-yellow-700" },
    out_of_stock: { text: "អស់ស្តុក", color: "bg-red-100 text-red-700" },
    restocking: { text: "កំពុងបញ្ជាទិញ", color: "bg-blue-100 text-blue-700" },
  }[product.stock_status || "in_stock"];

  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Back Button */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        ត្រឡប់ទៅកាតាឡុក
      </Link>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div
            className="aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in"
            onClick={() => {
              setMagnifierIndex(0);
              setMagnifierOpen(true);
            }}
          >
            {product.cover_image ? (
              <img
                src={product.cover_image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-300" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMagnifierIndex(i);
                    setMagnifierOpen(true);
                  }}
                  className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-colors"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
              {product.brand}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {product.category}
            </Badge>
            <Badge className={stockLabel.color}>{stockLabel.text}</Badge>
          </div>

          {product.restock_date &&
            (product.stock_status === "out_of_stock" ||
              product.stock_status === "restocking") && (
              <p className="text-sm text-gray-600">
                កាលបរិច្ឆេទមកដល់ប៉ាន់ស្មាន:{" "}
                {new Date(product.restock_date).toLocaleDateString("km-KH")}
              </p>
            )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Ruler className="w-4 h-4" />
                <span className="font-medium">ទំហំដែលមាន</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Palette className="w-4 h-4" />
                <span className="font-medium">ពណ៌ដែលមាន</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    <span className="text-sm text-gray-700">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {product.notes && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <p className="text-blue-700">{product.notes}</p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="pt-4 border-t">
            <Button size="lg" className="w-full h-14 text-lg">
              ទាក់ទងសម្រាប់ព័ត៌មានបន្ថែម
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts}
          title="ផលិតផលពាក់ព័ន្ធ"
          currentProductId={product.id}
        />
      )}

      {/* Image Magnifier */}
      {allImages.length > 0 && (
        <ImageMagnifier
          images={allImages}
          currentIndex={magnifierIndex}
          open={magnifierOpen}
          onClose={() => setMagnifierOpen(false)}
          onChangeIndex={setMagnifierIndex}
        />
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
