import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { seedCommentsData } from "./seed-comments-data";
import { ads, comments, users } from "./schema";

async function findUserId(email: string): Promise<number> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    throw new Error(`Cannot find seed user ${email}.`);
  }

  return user.id;
}

async function findAdId({
  adName,
  adModel,
  adYear,
}: {
  adName: string;
  adModel: string;
  adYear: number;
}): Promise<number> {
  const [ad] = await db
    .select({ id: ads.id })
    .from(ads)
    .where(
      and(eq(ads.name, adName), eq(ads.model, adModel), eq(ads.year, adYear)),
    );

  if (!ad) {
    throw new Error(`Cannot find seed ad ${adName} ${adModel} ${adYear}.`);
  }

  return ad.id;
}

async function migrateSeedComments() {
  console.log("Migrating seed comments...");

  let insertedCount = 0;
  let skippedCount = 0;
  const userIdCache = new Map<string, number>();
  const adIdCache = new Map<string, number>();

  for (const comment of seedCommentsData) {
    const adKey = `${comment.adName}:${comment.adModel}:${comment.adYear}`;
    const adId =
      adIdCache.get(adKey) ??
      (await findAdId({
        adName: comment.adName,
        adModel: comment.adModel,
        adYear: comment.adYear,
      }));
    adIdCache.set(adKey, adId);

    const userId =
      userIdCache.get(comment.ownerEmail) ??
      (await findUserId(comment.ownerEmail));
    userIdCache.set(comment.ownerEmail, userId);

    const [existingComment] = await db
      .select({ id: comments.id })
      .from(comments)
      .where(
        and(
          eq(comments.adId, adId),
          eq(comments.ownId, userId),
          eq(comments.text, comment.text),
        ),
      );

    if (existingComment) {
      skippedCount += 1;
      continue;
    }

    await db.insert(comments).values({
      adId,
      ownId: userId,
      text: comment.text,
      createdAt: comment.createdAt,
    });
    insertedCount += 1;
  }

  console.log(
    `Seed comments migration complete. Inserted ${insertedCount}, skipped ${skippedCount}.`,
  );
}

migrateSeedComments()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed comments migration failed:", error);
    process.exit(1);
  });
