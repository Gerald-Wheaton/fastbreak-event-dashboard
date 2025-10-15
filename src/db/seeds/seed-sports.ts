// Load environment variables first
import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../index";
import { sports } from "../schema";
import { SPORTS } from "./sports-data";

async function seedSports() {
  try {
    console.log("🌱 Seeding sports table...");

    // Check if sports already exist
    const existingSports = await db.select().from(sports);

    if (existingSports.length > 0) {
      console.log(
        `⚠️  Sports table already has ${existingSports.length} entries. Skipping seed.`
      );
      console.log("💡 To re-seed, first run: DELETE FROM sports;");
      process.exit(0);
    }

    // Insert all sports
    const result = await db.insert(sports).values(SPORTS).returning();

    console.log(`✅ Successfully seeded ${result.length} sports!`);

    // Display all sports as confirmation
    console.log("\n📋 Seeded sports:");
    result.forEach((sport) => {
      console.log(`   ${sport.id.padEnd(30)} → ${sport.name}`);
    });
    console.log();

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding sports:", error);
    process.exit(1);
  }
}

// Run the seed function
seedSports();
