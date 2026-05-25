import { and, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { getSeedAdDescription, seedAdsData } from "./seed-ads-data";
import { ads } from "./schema";

async function migrateAdDescriptions() {
  console.log("Migrating ad descriptions...");

  await db.execute(sql`
    ALTER TABLE "ads"
    ADD COLUMN IF NOT EXISTS "description" text DEFAULT '';
  `);

  let updatedCount = 0;

  for (const car of seedAdsData) {
    const description = car.description ?? getSeedAdDescription(car);

    await db
      .update(ads)
      .set({ description })
      .where(
        and(
          eq(ads.name, car.name),
          eq(ads.model, car.model),
          eq(ads.year, car.year),
        ),
      );
    updatedCount += 1;
  }

  await db.execute(sql`
    UPDATE "ads"
    SET "description" = CONCAT(
      "year",
      ' ',
      "name",
      ' ',
      "model",
      ' in good condition, suitable for everyday driving.'
    )
    WHERE "description" IS NULL OR "description" = '';
  `);

  await db.execute(sql`
    ALTER TABLE "ads"
    ALTER COLUMN "description" SET NOT NULL;
  `);

  console.log(`Ad descriptions migration complete. Updated ${updatedCount} seed descriptions.`);
}

migrateAdDescriptions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Ad descriptions migration failed:", error);
    process.exit(1);
  });
