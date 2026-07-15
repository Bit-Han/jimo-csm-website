
// import dotenv from "dotenv";
// import { resolve } from "path";
// dotenv.config({ path: resolve(process.cwd(), ".env") });

// import { seedTracking } from "./tracking";
// import { seedSeo } from "./seo";
// import { fixSuperAdminMetadata } from "./fix-superadmin-metadata";
// import { closeSeedDb } from "../seed-client";


// async function seed() {
//   console.log("Running seeds...");
//   await seedTracking();
//   await seedSeo();
//   await fixSuperAdminMetadata();
//   console.log("✓ All seeds complete.");
//   // Close the direct connection cleanly so the process exits
//   await closeSeedDb();
//   process.exit(0);
// }


//  seed().catch(async (error: unknown) => {
// 		console.error("RAW ERROR DUMP:", JSON.stringify(error, null, 2));
// 		console.error("RAW ERROR PROTO:", Object.getPrototypeOf(error));
// 		console.error("RAW ERROR FULL:", error);
// 		await closeSeedDb().catch(() => {});
// 		process.exit(1);
//  });


// lib/db/seeds/index.ts

// ── MUST BE FIRST — loads all env vars before anything else runs ──
import "./load-env";

// Now everything else can safely read process.env
import { seedTracking } from "./tracking";
import { seedSeo } from "./seo";
import { closeSeedDb } from "../seed-client";
import { seedProjects } from "./projects";
import { seedInsights } from "./insights";
import { seedBrochures } from "./brochures";
import { seedForms } from "./forms";
import { seedContent } from "./content";

async function seed() {
  console.log("Running seeds...");
    await seedTracking();
		await seedSeo();
		await seedProjects();
		await seedInsights();
		await seedBrochures();
		await seedForms();
    await seedContent();
  console.log("✓ All seeds complete.");
  await closeSeedDb();
  process.exit(0);
}

seed().catch(async (error: unknown) => {
  console.error("RAW ERROR DUMP:", JSON.stringify(error, null, 2));
  console.error("RAW ERROR FULL:", error);
  await closeSeedDb().catch(() => {});
  process.exit(1);
});