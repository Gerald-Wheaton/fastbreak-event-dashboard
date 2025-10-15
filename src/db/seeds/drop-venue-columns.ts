import { db } from "@/db";
import { sql } from "drizzle-orm";

async function dropVenueColumns() {
  try {
    console.log("Dropping unused columns from venues table...");

    // Drop the columns we no longer need
    await db.execute(sql`
      ALTER TABLE venues
      DROP COLUMN IF EXISTS latitude,
      DROP COLUMN IF EXISTS longitude,
      DROP COLUMN IF EXISTS url,
      DROP COLUMN IF EXISTS address_2,
      DROP COLUMN IF EXISTS notes;
    `);

    console.log("✅ Columns dropped successfully!");
  } catch (error) {
    console.error("❌ Error dropping columns:", error);
    throw error;
  }
}

dropVenueColumns()
  .then(() => {
    console.log("Migration complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
