import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { UserRole } from "@/lib/types";

let browserClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const getBrowserSupabase = (): SupabaseClient | null => {
  if (browserClient) return browserClient;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase public env vars are missing.");
    return null;
  }
  browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
};

export const getServiceSupabase = (): SupabaseClient => {
  if (serviceClient) return serviceClient;
  if (typeof window !== "undefined") {
    throw new Error("Service Supabase client must only be used server-side");
  }
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
  }
  serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return serviceClient;
};

export const allowedRoles: UserRole[] = ["admin", "manager", "user"];

export type SupabaseRole = UserRole;

