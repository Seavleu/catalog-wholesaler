import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

// For migrations/push, prefer DIRECT_URL (port 5432) if available
// Otherwise use DATABASE_URL (pooler, port 6543)
const dbUrl = process.env.DIRECT_URL || env("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
});

