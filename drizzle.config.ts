// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use transaction pooler (port 6543) for serverless
    url: process.env.DIRECT_URL!,
  },
} satisfies Config;