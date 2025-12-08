import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";
import { ProductEntity } from "@/lib/types";

export async function GET(req: Request) {
  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";
    
    let query = supabase.from("products").select("*");
    
    // Filter by active status if requested (for public catalog access)
    if (activeOnly) {
      query = query.eq("is_active", true);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
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
    
    // Exclude id, created_at, updated_at - these are auto-generated
    const { id, created_at, updated_at, ...insertData } = body;
    
    // Ensure id is not in the insert payload
    const insertPayload: any = {
      name: insertData.name,
      brand: insertData.brand || null,
      category: insertData.category || null,
      cover_image: insertData.cover_image || null,
      catalog_images: insertData.catalog_images || [],
      sizes: insertData.sizes || [],
      colors: insertData.colors || [],
      color_count: insertData.color_count || null,
      stock_status: insertData.stock_status || "in_stock",
      restock_date: insertData.restock_date || null,
      notes: insertData.notes || null,
      is_active: insertData.is_active !== false,
      updated_at: new Date().toISOString(),
    };
    
    // Explicitly remove id and created_at if they somehow got in
    delete insertPayload.id;
    delete insertPayload.created_at;
    
    const { data, error } = await supabase
      .from("products")
      .insert(insertPayload)
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

