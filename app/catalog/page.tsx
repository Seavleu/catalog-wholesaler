import { promises as fs } from "fs";
import path from "path";
import { ProductEntity } from "@/lib/base44Api";
import CatalogClient from "@/app/components/catalog/CatalogClient";
import { getServiceSupabase } from "@/lib/supabaseClient";

async function readCsvFallback(): Promise<ProductEntity[]> {
  const csvPath = path.join(process.cwd(), "Data", "Product_export.csv");
  try {
    const raw = await fs.readFile(csvPath, "utf8");
    const [headerLine, ...rows] = raw.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(",");
    return rows.map((line) => {
      const cols: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === "," && !inQuotes) {
          cols.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
      cols.push(current);

      const record: Record<string, string> = {};
      headers.forEach((h, idx) => {
        record[h] = cols[idx];
      });

      let catalogImages: string[] = [];
      try {
        catalogImages = JSON.parse(record["catalog_images"] || "[]");
      } catch {
        catalogImages = [];
      }

      return {
        id: record["id"] || crypto.randomUUID(),
        name: record["name"] || "Product",
        brand: record["brand"] || "",
        category: record["category"] || "",
        cover_image: record["cover_image"] || "",
        catalog_images: catalogImages,
        notes: record["notes"] || "",
        is_active: record["is_active"] !== "false",
        stock_status: "in_stock",
      } as ProductEntity;
    });
  } catch (err) {
    console.error("Failed to load CSV fallback", err);
    return [];
  }
}

async function getProducts(): Promise<ProductEntity[]> {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return data as ProductEntity[];
  } catch (err) {
    console.error("Primary product fetch failed, falling back to CSV:", err);
  }
  return readCsvFallback();
}

export default async function CatalogPage() {
  const products = await getProducts();

  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean) as string[])
  ).sort();

  return <CatalogClient initialProducts={products} brands={brands} />;
}
