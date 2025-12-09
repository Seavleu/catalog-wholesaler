import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { UserRole } from "@/lib/types";

let browserClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

export const getBrowserSupabase = (): SupabaseClient | null => {
  // Read env vars dynamically to ensure they're available in client context
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (browserClient) return browserClient;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase public env vars are missing.");
    return null;
  }
  browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
};

export const getServiceSupabase = (): SupabaseClient => {
  // Read env vars dynamically for server-side usage
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Security check: ensure this is only used server-side (must be before cache return)
  if (typeof window !== "undefined") {
    throw new Error("Service Supabase client must only be used server-side");
  }
  
  if (serviceClient) return serviceClient;
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

