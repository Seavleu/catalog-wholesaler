import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

