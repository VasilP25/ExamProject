import { and, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { getSeedAdPrice, seedAdsData } from "./seed-ads-data";
import { ads } from "./schema";

async function migrateAdPrices() {
  console.log("Migrating ad prices...");

  await db.execute(sql`
    ALTER TABLE "ads"
    ADD COLUMN IF NOT EXISTS "price" integer DEFAULT 0;
  `);

  let updatedCount = 0;

  for (const car of seedAdsData) {
    const price = car.price ?? getSeedAdPrice(car);

    await db
      .update(ads)
      .set({ price })
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
    SET "price" = 0
    WHERE "price" IS NULL;
  `);

  await db.execute(sql`
    ALTER TABLE "ads"
    ALTER COLUMN "price" SET NOT NULL;
  `);

  console.log(`Ad prices migration complete. Updated ${updatedCount} seed prices.`);
}

migrateAdPrices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Ad prices migration failed:", error);
    process.exit(1);
  });
