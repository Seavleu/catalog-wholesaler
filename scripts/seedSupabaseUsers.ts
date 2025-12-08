import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

type Role = "admin" | "manager" | "user";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const randomPassword = () =>
  randomBytes(6).toString("base64url") +
  randomBytes(4).toString("hex").toUpperCase();

const requiredRoles: Array<{
  role: Role;
  full_name: string;
  email?: string;
  phone?: string;
}> = [
  {
    role: "admin",
    full_name: "Admin User",
    email: "admin@meymeysport.com",
  },
  {
    role: "manager",
    full_name: "Manager User",
    email: "manager@meymeysport.com",
  },
  {
    role: "user",
    full_name: "Customer User",
    phone: "+855123456789", // Placeholder - should be updated with real phone
  },
];

async function getUsersByRole(role: Role) {
  const { data: list, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;

  return (
    list?.users.filter(
      (u) => u.app_metadata?.role === role || u.user_metadata?.role === role
    ) || []
  );
}

async function ensureRoleExists({
  role,
  full_name,
  email,
  phone,
}: {
  role: Role;
  full_name: string;
  email?: string;
  phone?: string;
}) {
  const existingUsers = await getUsersByRole(role);

  if (existingUsers.length > 0) {
    // Role already exists, ensure profiles exist for all users
    for (const user of existingUsers) {
      const { error: profileError } = await admin
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name: (user.user_metadata?.full_name as string) || full_name,
            role,
          },
          {
            onConflict: "id",
          }
        );
      if (profileError) {
        console.warn(`Failed to ensure profile for existing ${role} user ${user.id}:`, profileError.message);
      }
    }
    
    return existingUsers.map((u) => ({
      email: u.email || "N/A",
      phone: u.phone || "N/A",
      full_name: (u.user_metadata?.full_name as string) || full_name,
      role,
      status: "exists",
      user_id: u.id,
    }));
  }

  // No user with this role exists, create one
  const password = randomPassword();

  const { data: newUser, error: createError } =
    await admin.auth.admin.createUser({
      ...(email ? { email } : {}),
      ...(phone ? { phone, phone_confirm: true } : {}),
      password,
      email_confirm: email ? true : undefined,
      user_metadata: { full_name, role },
      app_metadata: { role },
    });

  if (createError) throw createError;

  // Also ensure profile exists - use service role to bypass RLS
  const { error: profileError } = await admin
    .from("profiles")
    .upsert(
      {
        id: newUser.user.id,
        full_name,
        role,
      },
      {
        onConflict: "id",
      }
    );

  if (profileError) {
    console.warn(`Failed to create profile for ${role}:`, profileError.message);
    console.warn("Profile error details:", JSON.stringify(profileError, null, 2));
  } else {
    console.log(`✓ Profile created/updated for ${role}: ${newUser.user.id}`);
  }

  return [
    {
      email: newUser.user.email || email || "N/A",
      phone: newUser.user.phone || phone || "N/A",
      full_name,
      role,
      password,
      status: "created",
      user_id: newUser.user.id,
    },
  ];
}

async function run() {
  console.log("Checking database for required users...\n");

  const results = [];
  for (const { role, full_name, email, phone } of requiredRoles) {
    const roleUsers = await ensureRoleExists({ role, full_name, email, phone });
    results.push(...roleUsers);
  }

  console.table(results);
  console.log("\nSeeding complete.");
  console.log("\nNote: Passwords are only shown for newly created users.");
  console.log("For existing users, use Supabase dashboard to reset passwords if needed.");
  console.log("\n⚠️  IMPORTANT: Update the phone number for the 'user' role with a real phone number!");
  console.log("   You can do this via the admin panel or Supabase dashboard.");
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

