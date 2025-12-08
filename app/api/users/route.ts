import { NextResponse } from "next/server";
import { getServiceSupabase, allowedRoles } from "@/lib/supabaseClient";
import { UserEntity } from "@/lib/types";
import { normalizePhoneToE164 } from "@/lib/phoneUtils";

type AdminUser = {
  id: string;
  email?: string | null;
  phone?: string | null;
  user_metadata?: Record<string, any>;
  created_at?: string;
};

const mapUser = (user: AdminUser): UserEntity => ({
  id: user.id,
  email: user.email || undefined,
  phone: user.phone || undefined,
  full_name:
    (user.user_metadata?.full_name as string | undefined) ||
    user.email ||
    user.phone ||
    undefined,
  role: (user.user_metadata?.role as UserEntity["role"]) || "user",
  created_date: user.created_at,
});

const generatePassword = () =>
  Math.random().toString(36).slice(-10) +
  Math.random().toString(36).slice(-4).toUpperCase();

export async function GET(req: Request) {
  try {
    const admin = getServiceSupabase();
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort");

    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (error) throw error;

    const users = (data?.users || []).map(mapUser);
    if (sort === "-created_date") {
      users.sort(
        (a, b) =>
          new Date(b.created_date || 0).getTime() -
          new Date(a.created_date || 0).getTime()
      );
    }

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("List users failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to list users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = getServiceSupabase();
    const body = await req.json();
    const {
      email,
      phone,
      password,
      role = "user",
      full_name,
    }: {
      email?: string;
      phone?: string;
      password?: string;
      role?: UserEntity["role"];
      full_name?: string;
    } = body || {};

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email or phone is required" },
        { status: 400 }
      );
    }

    if (role && !allowedRoles.includes(role as any)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const finalPassword = password || generatePassword();

    // Normalize phone number to E.164 format if provided
    const normalizedPhone = phone ? normalizePhoneToE164(phone) : undefined;

    const { data, error } = await admin.auth.admin.createUser({
      email: email || undefined,
      phone: normalizedPhone || undefined,
      password: finalPassword,
      email_confirm: true,
      ...(normalizedPhone ? { phone_confirm: true } : {}),
      user_metadata: { full_name, role },
      app_metadata: { role },
    });

    if (error) throw error;

    const created = mapUser(data.user as AdminUser);
    return NextResponse.json({ ...created, password: finalPassword });
  } catch (error: any) {
    console.error("Create user failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

