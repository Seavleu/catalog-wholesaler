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
  Camera,
  Send,
  MessageCircle,
} from "lucide-react";
import { app, ProductEntity } from "@/app/api/appClient";
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
        const products = await app.entities.Product.list();
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
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
      {/* Back Button */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>ត្រឡប់ទៅកាតាឡុក</span>
      </Link>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
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
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMagnifierIndex(i);
                    setMagnifierOpen(true);
                  }}
                  className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-colors min-h-[64px] sm:min-h-0"
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
        <div className="space-y-4 sm:space-y-6">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide">
              {product.brand}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {product.category}
            </Badge>
            <Badge className={`${stockLabel.color} text-xs sm:text-sm`}>{stockLabel.text}</Badge>
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
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Ruler className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">ទំហំដែលមាន</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, i) => (
                  <span
                    key={i}
                    className="px-3 sm:px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium text-sm sm:text-base min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {(product.colors && product.colors.length > 0) || product.color_count ? (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-gray-700 flex-wrap">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-sm sm:text-base">ពណ៌ដែលមាន</span>
                {product.color_count && product.color_count > (product.colors?.length || 0) && (
                  <span className="text-xs sm:text-sm text-gray-500">
                    ({product.color_count} ពណ៌សរុប)
                  </span>
                )}
              </div>
              {product.colors && product.colors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 sm:py-1.5 bg-gray-100 rounded-full min-h-[44px] sm:min-h-0"
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="text-sm sm:text-base text-gray-700">{color}</span>
                    </div>
                  ))}
                </div>
              )}
              {product.color_count && (!product.colors || product.colors.length === 0) && (
                <p className="text-sm sm:text-base text-gray-600">
                  មានពណ៌ {product.color_count} ផ្សេងៗ (មិនមានរូបភាព)
                </p>
              )}
            </div>
          ) : null}

          {/* Notes */}
          {product.notes && (
            <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm sm:text-base text-blue-700">{product.notes}</p>
            </div>
          )}

          {/* Telegram Instructions */}
          <div className="pt-4 border-t space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                    ចង់បញ្ជាទិញផលិតផលនេះ?
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm mb-3">
                    សូមថតរូបផលិតផលនេះ និងផ្ញើមកកាន់ Telegram របស់យើង
                  </p>
                  <a
                    href="https://t.me/your_telegram_username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-lg font-medium text-sm transition-colors shadow-sm w-full sm:w-auto min-h-[44px] sm:min-h-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>ផ្ញើទៅ Telegram</span>
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
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
