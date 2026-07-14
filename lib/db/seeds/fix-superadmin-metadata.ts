// import "./load-env"; 
// import { createAdminClient } from "../../supabase/admin";
// import { seedDb } from "../seed-client"; // ← use seedDb not db
// import { adminUsers } from "../schema";
// import { eq } from "drizzle-orm";

// const SUPERADMIN_EMAIL = "jimorealestate45@gmail.com";
// const SUPERADMIN_FULL_NAME = "Onyekachi John";

// export async function fixSuperAdminMetadata() {
//   console.log("Looking up user in Supabase Auth...");

//   const adminSupabase = createAdminClient();

//   const {
//     data: { users },
//     error: listError,
//   } = await adminSupabase.auth.admin.listUsers();

//   if (listError) {
//     throw new Error(`Failed to list users: ${listError.message}`);
//   }

//   const authUser = users.find((u) => u.email === SUPERADMIN_EMAIL);

//   if (!authUser) {
//     throw new Error(
//       `No Supabase Auth user found with email: ${SUPERADMIN_EMAIL}\n` +
//         "Check the email matches exactly (case-sensitive)."
//     );
//   }

//   console.log(`Found auth user: ${authUser.id}`);
//   console.log(
//     `Current app_metadata: ${JSON.stringify(authUser.app_metadata)}`
//   );

//   // Set adminRole in app_metadata
//   const { error: updateError } =
//     await adminSupabase.auth.admin.updateUserById(authUser.id, {
//       app_metadata: {
//         ...authUser.app_metadata,
//         adminRole: "super-admin",
//       },
//     });

//   if (updateError) {
//     throw new Error(`Failed to update app_metadata: ${updateError.message}`);
//   }

//   console.log("✓ app_metadata.adminRole set to super-admin");

//   // Ensure admin_users row exists
//   const existingRow = await seedDb.query.adminUsers.findFirst({
//     where: eq(adminUsers.id, authUser.id),
//   });

//   if (existingRow) {
//     await seedDb
//       .update(adminUsers)
//       .set({ role: "super-admin", status: "active" })
//       .where(eq(adminUsers.id, authUser.id));
//     console.log("✓ admin_users row updated (role → super-admin)");
//   } else {
//     const usernameBase = SUPERADMIN_FULL_NAME.toLowerCase()
//       .replace(/[^a-z0-9]/g, ".")
//       .replace(/\.{2,}/g, ".");

//     await seedDb.insert(adminUsers).values({
//       id: authUser.id,
//       fullName: SUPERADMIN_FULL_NAME,
//       username: `${usernameBase}.admin`,
//       email: SUPERADMIN_EMAIL,
//       role: "super-admin",
//       status: "active",
//     });
//     console.log("✓ admin_users row created");
//   }

//   // ← NO process.exit here — let the seed runner handle it
//   console.log("✓ Superadmin metadata fixed.");
// }


// lib/db/seeds/fix-superadmin-metadata.ts

// lib/db/seeds/fix-superadmin-metadata.ts
// Standalone script — run via: pnpm db:fix-admin
// Uses tsx --env-file=.env so no manual dotenv loading needed

import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";
import { adminUsers } from "../schema";
import { eq } from "drizzle-orm";

// ── Edit these ────────────────────────────────────────────────────────────────
const SUPERADMIN_EMAIL = "jimorealestate45@gmail.com";
const SUPERADMIN_FULL_NAME = "Onyekachi John";
// ─────────────────────────────────────────────────────────────────────────────

async function fixSuperAdminMetadata() {
  // Log what we have so we can debug without exposing values
  console.log("=== ENV CHECK ===");
  console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? `SET (${process.env.SUPABASE_URL.slice(0, 30)}...)` : "MISSING");
  console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? `SET (length: ${process.env.SUPABASE_SERVICE_ROLE_KEY.length})` : "MISSING");
  console.log("DIRECT_URL:", process.env.DIRECT_URL ? "SET" : "MISSING");
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "MISSING");
  console.log("================");

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is missing from .env");
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing from .env\n" +
      "Get it from: Supabase Dashboard → Project Settings → API → service_role (secret)"
    );
  }

  if (!dbUrl) {
    throw new Error("DIRECT_URL or DATABASE_URL is missing from .env");
  }

  // Create Supabase admin client directly — no createAdminClient() wrapper
  const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Create DB client directly — no seed-client.ts dependency
  const pgClient = postgres(dbUrl, {
    max: 1,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 30,
  });
  const db = drizzle(pgClient, { schema });

  console.log("Looking up user in Supabase Auth...");

  const {
    data: { users },
    error: listError,
  } = await adminSupabase.auth.admin.listUsers();

  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const authUser = users.find((u) => u.email === SUPERADMIN_EMAIL);

  if (!authUser) {
    throw new Error(
      `No Supabase Auth user found with email: ${SUPERADMIN_EMAIL}\n` +
        "Check the email matches exactly (case-sensitive)."
    );
  }

  console.log(`✓ Found auth user: ${authUser.id}`);
  console.log(`Current app_metadata: ${JSON.stringify(authUser.app_metadata)}`);

  // Set adminRole in app_metadata
  const { error: updateError } =
    await adminSupabase.auth.admin.updateUserById(authUser.id, {
      app_metadata: {
        ...authUser.app_metadata,
        adminRole: "super-admin",
      },
    });

  if (updateError) {
    throw new Error(`Failed to update app_metadata: ${updateError.message}`);
  }

  console.log("✓ app_metadata.adminRole set to super-admin");

  // Ensure admin_users row exists
  const existingRow = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.id, authUser.id),
  });

  if (existingRow) {
    await db
      .update(adminUsers)
      .set({ role: "super-admin", status: "active" })
      .where(eq(adminUsers.id, authUser.id));
    console.log("✓ admin_users row updated → super-admin");
  } else {
    const usernameBase = SUPERADMIN_FULL_NAME.toLowerCase()
      .replace(/[^a-z0-9]/g, ".")
      .replace(/\.{2,}/g, ".");

    await db.insert(adminUsers).values({
      id: authUser.id,
      fullName: SUPERADMIN_FULL_NAME,
      username: `${usernameBase}.admin`,
      email: SUPERADMIN_EMAIL,
      role: "super-admin",
      status: "active",
    });
    console.log("✓ admin_users row created");
  }

  await pgClient.end();
  console.log("\n✓ Done. Sign in at /admin/auth/login with your credentials.");
}

fixSuperAdminMetadata()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("\nFailed:", message);
    process.exit(1);
  });