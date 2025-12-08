import { ProductEntity } from "@/lib/types";
import CatalogClient from "@/app/components/catalog/CatalogClient";

async function getProducts(): Promise<ProductEntity[]> {
  try {
    // Use the API route for consistency and to respect RLS policies
    // In Next.js server components, we can use relative URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    
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

export default async function CatalogPage() {
  const products = await getProducts();

  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean) as string[])
  ).sort();

  return <CatalogClient initialProducts={products} brands={brands} />;
}
