import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabaseClient";

type Params = { params: { id: string } };

export async function DELETE(_: Request, { params }: Params) {
  try {
    const admin = getServiceSupabase();
    const { error } = await admin.auth.admin.deleteUser(params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete user failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}

