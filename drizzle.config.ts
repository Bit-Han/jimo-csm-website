// drizzle.config.ts
import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use transaction pooler (port 6543) for serverless
    url: process.env.DIRECT_URL! ?? process.env.DATABASE_URL!,
  },
} satisfies Config;