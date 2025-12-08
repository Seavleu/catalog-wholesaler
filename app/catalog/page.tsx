import { ProductEntity } from "@/lib/base44Api";
import CatalogClient from "@/app/components/catalog/CatalogClient";
import { getServiceSupabase } from "@/lib/supabaseClient";

async function getProducts(): Promise<ProductEntity[]> {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as ProductEntity[];
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
