"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductEntity } from "@/lib/types";
import CatalogClient from "@/app/components/catalog/CatalogClient";
import { app } from "@/app/api/appClient";
import { Loader2 } from "lucide-react";

async function getProducts(): Promise<ProductEntity[]> {
  try {
    // Use the API route for consistency and to respect RLS policies
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    
    const res = await fetch(`${baseUrl}/api/products?active=true`, {
      cache: "no-store", // Always fetch fresh data for catalog
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    
    const products = (await res.json()) as ProductEntity[];
    // Filter active products (API should already filter, but double-check)
    return products.filter((p) => p.is_active !== false);
  } catch (err) {
    console.error("Failed to fetch products from API:", err);
    return [];
  }
}

export default function CatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        // Check if user is logged in
        const user = await app.auth.me();
        if (!user) {
          // Redirect to login if not authenticated
          router.push("/login");
          return;
        }

        // User is authenticated, load products
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      } finally {
        setCheckingAuth(false);
        setLoading(false);
      }
    }

    checkAuthAndLoad();
  }, [router]);

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean) as string[])
  ).sort();

  return <CatalogClient initialProducts={products} brands={brands} />;
}
