import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { ads, users } from "./schema";

const carPhotoData = [
  {
    name: "Ford",
    model: "Focus",
    year: 2012,
    ownerEmail: "steve@gmail.com",
    likes: 5,
    picture:
      "https://commons.wikimedia.org/wiki/Special:FilePath/2012_Ford_Focus_SE_hatch_front_--_04-19-2011.jpg",
  },
  {
    name: "Toyota",
    model: "Corolla",
    year: 2013,
    ownerEmail: "peter@gmail.com",
    likes: 8,
    picture:
      "https://commons.wikimedia.org/wiki/Special:FilePath/%2713_Toyota_Corolla_%28SDLDQ_%2713%29.jpg",
  },
  {
    name: "BMW",
    model: "320d",
    year: 2018,
    ownerEmail: "john@gmail.com",
    likes: 12,
    picture:
      "https://commons.wikimedia.org/wiki/Special:FilePath/BMW_320d.JPG",
  },
];

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

async function migrateCarPhotos() {
  console.log("Migrating car photo data...");

  for (const car of carPhotoData) {
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
        .set({ picture: car.picture })
        .where(eq(ads.id, existingAd.id));
      console.log(`Updated ${car.name} ${car.model}.`);
      continue;
    }

    const ownerId = await findOwnerId(car.ownerEmail);
    await db.insert(ads).values({
      name: car.name,
      model: car.model,
      year: car.year,
      picture: car.picture,
      ownId: ownerId,
      likes: car.likes,
    });
    console.log(`Inserted ${car.name} ${car.model}.`);
  }

  console.log("Car photo migration complete.");
}

migrateCarPhotos()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Car photo migration failed:", error);
    process.exit(1);
  });
