import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { ads, comments, users } from "../db/schema";
import type { AuthUser } from "../lib/auth";

export type DashboardAd = {
  id: number;
  name: string;
  model: string;
  year: number;
  picture: string | null;
  ownerId: number;
  ownerName: string;
  commentCount: number;
};

export type AdsPaginationResult = {
  ads: DashboardAd[];
  page: number;
  pageSize: number;
  hasMore: boolean;
};

const ADS_PAGE_SIZE = 10;

export async function getAds(
  name = "",
  model = "",
  year = "",
  page = 1,
  pageSize = ADS_PAGE_SIZE,
): Promise<AdsPaginationResult> {
  const trimmedName = name.trim();
  const trimmedModel = model.trim();
  const trimmedYear = year.trim();
  const offset = (Math.max(page, 1) - 1) * pageSize;

  const filters: any[] = [];

  if (trimmedName) {
    filters.push(sql`LOWER(${ads.name}) LIKE LOWER(${`%${trimmedName}%`})`);
  }

  if (trimmedModel) {
    filters.push(sql`LOWER(${ads.model}) LIKE LOWER(${`%${trimmedModel}%`})`);
  }

  if (trimmedYear) {
    const yearNumber = Number(trimmedYear);

    if (!Number.isNaN(yearNumber)) {
      filters.push(eq(ads.year, yearNumber));
    } else {
      filters.push(sql`CAST(${ads.year} AS TEXT) LIKE ${`%${trimmedYear}%`}`);
    }
  }

  const fetchedAds = await db
    .select({
      id: ads.id,
      name: ads.name,
      model: ads.model,
      year: ads.year,
      picture: ads.picture,
      ownerId: ads.ownId,
      ownerName: users.name,
      commentCount: sql<number>`COALESCE(COUNT(${comments.id}), 0)`,
    })
    .from(ads)
    .leftJoin(comments, eq(comments.adId, ads.id))
    .innerJoin(users, eq(ads.ownId, users.id))
    .where(filters.length ? and(...filters) : undefined)
    .groupBy(
      ads.id,
      ads.name,
      ads.model,
      ads.year,
      ads.picture,
      ads.ownId,
      users.name,
      ads.createdAt,
    )
    .orderBy(desc(ads.createdAt), desc(ads.id))
    .limit(pageSize + 1)
    .offset(offset);

  return {
    ads: fetchedAds.slice(0, pageSize),
    page: Math.max(page, 1),
    pageSize,
    hasMore: fetchedAds.length > pageSize,
  };
}

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
      commentCount: sql<number>`COALESCE(COUNT(${comments.id}), 0)`,
    })
    .from(ads)
    .leftJoin(comments, eq(comments.adId, ads.id))
    .innerJoin(users, eq(ads.ownId, users.id))
    .groupBy(
      ads.id,
      ads.name,
      ads.model,
      ads.year,
      ads.picture,
      ads.ownId,
      users.name,
      ads.createdAt,
    )
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

export type AdComment = {
  id: number;
  text: string;
  ownerName: string;
  createdAt: Date | null;
};

export async function getAdDetail(adId: number): Promise<DashboardAd | null> {
  const [ad] = await db
    .select({
      id: ads.id,
      name: ads.name,
      model: ads.model,
      year: ads.year,
      picture: ads.picture,
      ownerId: ads.ownId,
      ownerName: users.name,
      commentCount: sql<number>`COALESCE(COUNT(${comments.id}), 0)`,
    })
    .from(ads)
    .leftJoin(comments, eq(comments.adId, ads.id))
    .innerJoin(users, eq(ads.ownId, users.id))
    .where(eq(ads.id, adId))
    .groupBy(
      ads.id,
      ads.name,
      ads.model,
      ads.year,
      ads.picture,
      ads.ownId,
      users.name,
      ads.createdAt,
    )
    .limit(1);

  return ad ?? null;
}

export async function getCommentsForAd(adId: number): Promise<AdComment[]> {
  return db
    .select({
      id: comments.id,
      text: comments.text,
      ownerName: users.name,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .innerJoin(users, eq(comments.ownId, users.id))
    .where(eq(comments.adId, adId))
    .orderBy(desc(comments.createdAt));
}
