import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function listAllUsers() {
  console.log("Fetching all users from Supabase...\n");

  const { data: usersList, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    console.error("Failed to list users:", listError);
    process.exit(1);
  }

  if (!usersList?.users || usersList.users.length === 0) {
    console.log("No users found.");
    return;
  }

  console.log(`Found ${usersList.users.length} users:\n`);
  console.log("=".repeat(100));

  const users = usersList.users.map((user) => {
    const role = (user.app_metadata?.role || user.user_metadata?.role || "user") as string;
    const full_name = (user.user_metadata?.full_name as string) || user.email || user.phone || "User";

    return {
      id: user.id,
      email: user.email || "N/A",
      phone: user.phone || "N/A",
      full_name,
      role,
      created_at: user.created_at,
      email_confirmed: user.email_confirmed_at ? "Yes" : "No",
      phone_confirmed: user.phone_confirmed_at ? "Yes" : "No",
    };
  });

  console.table(users);

  console.log("\n" + "=".repeat(100));
  console.log("\n📝 IMPORTANT NOTES:");
  console.log("1. Passwords are stored securely in Supabase Auth and cannot be viewed.");
  console.log("2. To reset a password, use Supabase Dashboard → Authentication → Users → Reset Password");
  console.log("3. Or use the admin panel in your app to create new users (passwords shown on creation)");
  console.log("4. The seed script only shows passwords when creating NEW users, not existing ones.");
  console.log("\n💡 To get passwords for existing users:");
  console.log("   - Reset password via Supabase Dashboard");
  console.log("   - Or create new users via admin panel (password will be shown)");
}

listAllUsers().catch((err) => {
  console.error("Failed to list users:", err);
  process.exit(1);
});

