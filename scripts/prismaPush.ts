import { execSync } from "child_process";
import dotenv from "dotenv";

// Load env vars (prisma.config.ts will automatically use DIRECT_URL if available)
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const directUrl = process.env.DIRECT_URL;
const acceptDataLoss = process.argv.includes("--accept-data-loss");

if (!directUrl) {
  console.error("DIRECT_URL not found in .env.local");
  console.error("Please set DIRECT_URL for direct database connection (port 5432)");
  process.exit(1);
}

console.log("Using direct connection for Prisma db push...");
console.log(`Connecting to: ${directUrl.replace(/:[^:@]+@/, ":****@")}`);

try {
  const args = ["prisma", "db", "push"];
  if (acceptDataLoss) {
    args.push("--accept-data-loss");
  }
  
  execSync(`npx ${args.join(" ")}`, {
    stdio: "inherit",
    env: process.env,
  });
  
  console.log("✅ Prisma db push completed successfully!");
} catch (error: any) {
  console.error("❌ Prisma db push failed:", error.message || error);
  process.exit(1);
}

