import { ProductEntity, fetchProductEntities } from "@/lib/base44Api";
import CatalogClient from "@/app/components/catalog/CatalogClient";

async function getProducts(): Promise<ProductEntity[]> {
  return fetchProductEntities();
}

export default async function CatalogPage() {
  const products = await getProducts();

  // Precompute brand list
  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean) as string[])
  ).sort();

  return <CatalogClient initialProducts={products} brands={brands} />;
}
