import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";
import { ProductEntity } from "@/lib/base44Api";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = (await req.json()) as Partial<ProductEntity>;
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("products")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data as ProductEntity);
  } catch (err: any) {
    console.error("products PUT failed", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const supabase = getServiceSupabase();
    const { error } = await supabase.from("products").delete().eq("id", params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("products DELETE failed", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

