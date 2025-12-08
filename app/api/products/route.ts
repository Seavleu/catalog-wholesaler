import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";
import { ProductEntity } from "@/lib/base44Api";

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json((data || []) as ProductEntity[]);
  } catch (err: any) {
    console.error("products GET failed", err);
    return NextResponse.json(
      { error: err?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<ProductEntity>;
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name,
        brand: body.brand,
        category: body.category,
        cover_image: body.cover_image,
        catalog_images: body.catalog_images || [],
        sizes: body.sizes || [],
        colors: body.colors || [],
        stock_status: body.stock_status || "in_stock",
        restock_date: body.restock_date || null,
        notes: body.notes,
        is_active: body.is_active !== false,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data as ProductEntity);
  } catch (err: any) {
    console.error("products POST failed", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

