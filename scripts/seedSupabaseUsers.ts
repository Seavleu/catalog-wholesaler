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

const seedUsers: Array<{
  email: string;
  full_name: string;
  role: Role;
  password: string;
}> = [
  {
    email: "admin@example.com",
    full_name: "Admin User",
    role: "admin",
    password: "admin123",
  },
  {
    email: "manager@example.com",
    full_name: "Manager User",
    role: "manager",
    password: "manager123",
  },
  {
    email: "user@example.com",
    full_name: "Customer User",
    role: "user",
    password: "user123",
  },
];

async function ensureUser({
  email,
  full_name,
  role,
  password,
}: {
  email: string;
  full_name: string;
  role: Role;
  password?: string;
}) {
  const { data: list, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;

  const existing = list?.users.find((u) => u.email === email);
  if (existing) {
    await admin.auth.admin.updateUserById(existing.id, {
      password,
      user_metadata: { full_name, role },
      app_metadata: { role },
    });
    return { email, password, role, status: "updated" };
  }

  const finalPassword = password || randomPassword();
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password: finalPassword,
    email_confirm: true,
    user_metadata: { full_name, role },
    app_metadata: { role },
  });
  if (createError) throw createError;
  return { email, password: finalPassword, role, status: "created" };
}

async function run() {
  const results = [];
  for (const user of seedUsers) {
    results.push(await ensureUser(user));
  }
  console.table(results);
  console.log("Seeding complete.");
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

