import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CsvRecord = {
  name: string;
  brand?: string;
  category?: string;
  cover_image?: string;
  catalog_images?: string[];
  notes?: string;
  is_active?: boolean;
  stock_status?: string;
  restock_date?: Date | null;
  created_date?: Date | null;
  updated_date?: Date | null;
  created_by_id?: string | null;
  created_by?: string | null;
  is_sample?: boolean | null;
};

function parseCsvLine(line: string): string[] {
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
  return cols;
}

function parseDate(val?: string): Date | null {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

async function main() {
  const csvPath = path.join(process.cwd(), "Data", "Product_export.csv");
  const raw = await fs.readFile(csvPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    console.warn("No data rows found in CSV");
    return;
  }
  const headers = parseCsvLine(lines[0]);

  const records: CsvRecord[] = lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
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
      name: record["name"] || "Product",
      brand: record["brand"] || undefined,
      category: record["category"] || undefined,
      cover_image: record["cover_image"] || undefined,
      catalog_images: catalogImages,
      notes: record["notes"] || undefined,
      is_active: record["is_active"] !== "false",
      stock_status: record["stock_status"] || "in_stock",
      restock_date: parseDate(record["restock_date"]),
      created_date: parseDate(record["created_date"]),
      updated_date: parseDate(record["updated_date"]),
      created_by_id: record["created_by_id"] || null,
      created_by: record["created_by"] || null,
      is_sample:
        record["is_sample"] === undefined
          ? null
          : record["is_sample"].toLowerCase() === "true",
    };
  });

  console.log(`Importing ${records.length} rows into product_stage...`);
  await prisma.productStage.deleteMany();
  await prisma.productStage.createMany({
    data: records,
    skipDuplicates: true,
  });
  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

