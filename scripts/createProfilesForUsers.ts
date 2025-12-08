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

async function createProfilesForAllUsers() {
  console.log("Fetching all users from auth.users...\n");

  // Get all users
  const { data: usersList, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    console.error("Failed to list users:", listError);
    process.exit(1);
  }

  if (!usersList?.users || usersList.users.length === 0) {
    console.log("No users found in auth.users");
    return;
  }

  console.log(`Found ${usersList.users.length} users. Creating/updating profiles...\n`);

  const results = [];
  for (const user of usersList.users) {
    const role = (user.app_metadata?.role || user.user_metadata?.role || "user") as string;
    const full_name = (user.user_metadata?.full_name as string) || user.email || user.phone || "User";

    const { error: profileError } = await admin
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name,
          role,
        },
        {
          onConflict: "id",
        }
      );

    if (profileError) {
      console.error(`Failed to create profile for user ${user.id}:`, profileError.message);
      results.push({
        id: user.id,
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        role,
        status: "failed",
        error: profileError.message,
      });
    } else {
      console.log(`✓ Profile created/updated for ${role}: ${full_name} (${user.email || user.phone || user.id})`);
      results.push({
        id: user.id,
        email: user.email || "N/A",
        phone: user.phone || "N/A",
        role,
        full_name,
        status: "success",
      });
    }
  }

  console.log("\n" + "=".repeat(80));
  console.table(results);
  console.log("\nProfiles creation complete!");
}

createProfilesForAllUsers().catch((err) => {
  console.error("Failed to create profiles:", err);
  process.exit(1);
});

