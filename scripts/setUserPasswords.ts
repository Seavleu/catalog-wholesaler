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

// Define passwords for each role
const userPasswords: Array<{
  email?: string;
  phone?: string;
  role: "admin" | "manager" | "user";
  password: string;
  description: string;
}> = [
  {
    email: "admin@example.com",
    role: "admin",
    password: "admin123",
    description: "Admin User",
  },
  {
    email: "manager@example.com",
    role: "manager",
    password: "manager123",
    description: "Manager User",
  },
  {
    email: "user@example.com",
    role: "user",
    password: "user123",
    description: "Customer User",
  },
];

async function setUserPasswords() {
  console.log("Setting passwords for users...\n");
  console.log("=".repeat(80));

  const results = [];

  for (const { email, phone, role, password, description } of userPasswords) {
    try {
      // Find the user by email or phone
      const { data: usersList, error: listError } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

      if (listError) {
        throw listError;
      }

      // First try to find by exact email/phone match, then by role
      let user = usersList?.users.find(
        (u) => (email && u.email === email) || (phone && u.phone === phone)
      );
      
      // If not found by exact match, find by role (but prefer email-based users)
      if (!user) {
        const roleUsers = usersList?.users.filter(
          (u) => u.app_metadata?.role === role || u.user_metadata?.role === role
        );
        // Prefer email-based users if available
        user = roleUsers?.find((u) => u.email) || roleUsers?.[0];
      }

      if (!user) {
        console.log(`❌ User not found: ${description} (${email || phone || role})`);
        results.push({
          description,
          email: email || "N/A",
          phone: phone || "N/A",
          role,
          status: "not_found",
          password: "N/A",
        });
        continue;
      }

      // Update the user's password
      const { data: updatedUser, error: updateError } = await admin.auth.admin.updateUserById(
        user.id,
        {
          password: password,
        }
      );

      if (updateError) {
        throw updateError;
      }

      console.log(`✅ Password set for ${description}:`);
      console.log(`   Email/Phone: ${updatedUser.user.email || updatedUser.user.phone || "N/A"}`);
      console.log(`   Role: ${role}`);
      console.log(`   Password: ${password}`);
      console.log("");

      results.push({
        description,
        email: updatedUser.user.email || "N/A",
        phone: updatedUser.user.phone || "N/A",
        role,
        status: "success",
        password,
      });
    } catch (error: any) {
      console.error(`❌ Failed to set password for ${description}:`, error.message);
      results.push({
        description,
        email: email || "N/A",
        phone: phone || "N/A",
        role,
        status: "failed",
        password: "N/A",
        error: error.message,
      });
    }
  }

  console.log("=".repeat(80));
  console.log("\n📋 Summary:\n");
  console.table(results);

  console.log("\n✅ Password setup complete!");
  console.log("\n📝 Login Credentials:");
  console.log("   Admin:   admin@example.com / admin123");
  console.log("   Manager: manager@example.com / manager123");
  console.log("   User:    user@example.com / user123");
  console.log("\n💡 Users can change their passwords after logging in.");
  console.log("   (You'll need to implement a password change feature in your app)");
}

setUserPasswords().catch((err) => {
  console.error("Failed to set passwords:", err);
  process.exit(1);
});

