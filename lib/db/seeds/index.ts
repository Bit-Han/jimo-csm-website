import { seedTracking } from "./tracking";
import { seedSeo } from "./seo";
import { closeSeedDb } from "../seed-client";

async function seed() {
  console.log("Running seeds...");
  await seedTracking();
  await seedSeo();
  console.log("✓ All seeds complete.");
  // Close the direct connection cleanly so the process exits
  await closeSeedDb();
  process.exit(0);
}


 seed().catch(async (error: unknown) => {
		console.error("RAW ERROR DUMP:", JSON.stringify(error, null, 2));
		console.error("RAW ERROR PROTO:", Object.getPrototypeOf(error));
		console.error("RAW ERROR FULL:", error);
		await closeSeedDb().catch(() => {});
		process.exit(1);
 });
