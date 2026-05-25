import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { getSeedAdDescription, seedAdsData } from "./seed-ads-data";
import { ads, users } from "./schema";

async function findOwnerId(ownerEmail: string): Promise<number> {
  const [owner] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, ownerEmail));

  if (!owner) {
    throw new Error(`Cannot find seed user ${ownerEmail}.`);
  }

  return owner.id;
}

async function migrateSeedAds() {
  console.log("Migrating seed ads...");

  let insertedCount = 0;
  let updatedCount = 0;

  for (const car of seedAdsData) {
    const description = car.description ?? getSeedAdDescription(car);
    const [existingAd] = await db
      .select({ id: ads.id })
      .from(ads)
      .where(
        and(
          eq(ads.name, car.name),
          eq(ads.model, car.model),
          eq(ads.year, car.year),
        ),
      );

    if (existingAd) {
      await db
        .update(ads)
        .set({ description, picture: car.picture, likes: car.likes })
        .where(eq(ads.id, existingAd.id));
      updatedCount += 1;
      continue;
    }

    const ownerId = await findOwnerId(car.ownerEmail);
    await db.insert(ads).values({
      name: car.name,
      model: car.model,
      year: car.year,
      description,
      picture: car.picture,
      ownId: ownerId,
      likes: car.likes,
    });
    insertedCount += 1;
  }

  console.log(`Seed ads migration complete. Inserted ${insertedCount}, updated ${updatedCount}.`);
}

migrateSeedAds()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed ads migration failed:", error);
    process.exit(1);
  });
