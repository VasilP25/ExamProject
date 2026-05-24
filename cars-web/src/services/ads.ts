import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { ads, users } from "../db/schema";
import type { AuthUser } from "../lib/auth";

export type DashboardAd = {
  id: number;
  name: string;
  model: string;
  year: number;
  picture: string | null;
  ownerId: number;
  ownerName: string;
};

export type CreateAdInput = {
  name: string;
  model: string;
  year: number;
  picture?: string;
  ownerId: number;
};

export async function getLatestAds(limit = 3): Promise<DashboardAd[]> {
  return db
    .select({
      id: ads.id,
      name: ads.name,
      model: ads.model,
      year: ads.year,
      picture: ads.picture,
      ownerId: ads.ownId,
      ownerName: users.name,
    })
    .from(ads)
    .innerJoin(users, eq(ads.ownId, users.id))
    .orderBy(desc(ads.createdAt), desc(ads.id))
    .limit(limit);
}

export async function createAd({
  name,
  model,
  year,
  picture,
  ownerId,
}: CreateAdInput): Promise<void> {
  await db.insert(ads).values({
    name,
    model,
    year,
    picture: picture || null,
    ownId: ownerId,
    likes: 0,
  });
}

export async function deleteAdForUser(
  adId: number,
  user: AuthUser,
): Promise<boolean> {
  const isAdmin = user.userType === "admin";
  const deleteCondition = isAdmin
    ? eq(ads.id, adId)
    : and(eq(ads.id, adId), eq(ads.ownId, user.id));

  const deletedAds = await db
    .delete(ads)
    .where(deleteCondition)
    .returning({ id: ads.id });

  return deletedAds.length > 0;
}
