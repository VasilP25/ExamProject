import { and, desc, eq, isNull, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../db";
import { ads, bannedComments, comments, users } from "../db/schema";
import type { AuthUser } from "../lib/auth";

export type DashboardAd = {
  id: number;
  name: string;
  model: string;
  year: number;
  description: string;
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

const ADS_PAGE_SIZE = 9;

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

  const filters: SQL[] = [];

  if (trimmedName) {
    filters.push(sql`LOWER(${ads.name}) LIKE LOWER(${`%${trimmedName}%`})`);
  }

  if (trimmedModel) {
    filters.push(sql`LOWER(${ads.model}) LIKE LOWER(${`%${trimmedModel}%`})`);
  }

  if (trimmedYear) {
    filters.push(sql`CAST(${ads.year} AS TEXT) LIKE ${`%${trimmedYear}%`}`);
  }

  const fetchedAds = await db
    .select({
      id: ads.id,
      name: ads.name,
      model: ads.model,
      year: ads.year,
      description: ads.description,
      picture: ads.picture,
      ownerId: ads.ownId,
      ownerName: users.name,
      commentCount: sql<number>`COALESCE(COUNT(${comments.id}) FILTER (WHERE ${bannedComments.id} IS NULL), 0)`,
    })
    .from(ads)
    .leftJoin(comments, eq(comments.adId, ads.id))
    .leftJoin(bannedComments, eq(bannedComments.commentId, comments.id))
    .innerJoin(users, eq(ads.ownId, users.id))
    .where(filters.length ? and(...filters) : undefined)
    .groupBy(
      ads.id,
      ads.name,
      ads.model,
      ads.year,
      ads.description,
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
  description: string;
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
      description: ads.description,
      picture: ads.picture,
      ownerId: ads.ownId,
      ownerName: users.name,
      commentCount: sql<number>`COALESCE(COUNT(${comments.id}) FILTER (WHERE ${bannedComments.id} IS NULL), 0)`,
    })
    .from(ads)
    .leftJoin(comments, eq(comments.adId, ads.id))
    .leftJoin(bannedComments, eq(bannedComments.commentId, comments.id))
    .innerJoin(users, eq(ads.ownId, users.id))
    .groupBy(
      ads.id,
      ads.name,
      ads.model,
      ads.year,
      ads.description,
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
  description,
  picture,
  ownerId,
}: CreateAdInput): Promise<void> {
  await db.insert(ads).values({
    name,
    model,
    year,
    description,
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
  adId: number;
  text: string;
  ownerId: number;
  ownerName: string;
  createdAt: Date | null;
};

export type DeletedComment = {
  id: number;
  originalCommentId: number;
  adId: number;
  adName: string;
  adModel: string;
  commentText: string;
  commentOwnerId: number | null;
  commentOwnerName: string | null;
  commentCreatedAt: Date | null;
  bannedAt: Date | null;
  bannedByName: string;
};

export async function getAdDetail(adId: number): Promise<DashboardAd | null> {
  const [ad] = await db
    .select({
      id: ads.id,
      name: ads.name,
      model: ads.model,
      year: ads.year,
      description: ads.description,
      picture: ads.picture,
      ownerId: ads.ownId,
      ownerName: users.name,
      commentCount: sql<number>`COALESCE(COUNT(${comments.id}) FILTER (WHERE ${bannedComments.id} IS NULL), 0)`,
    })
    .from(ads)
    .leftJoin(comments, eq(comments.adId, ads.id))
    .leftJoin(bannedComments, eq(bannedComments.commentId, comments.id))
    .innerJoin(users, eq(ads.ownId, users.id))
    .where(eq(ads.id, adId))
    .groupBy(
      ads.id,
      ads.name,
      ads.model,
      ads.year,
      ads.description,
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
      adId: comments.adId,
      text: comments.text,
      ownerId: comments.ownId,
      ownerName: users.name,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .leftJoin(bannedComments, eq(bannedComments.commentId, comments.id))
    .innerJoin(users, eq(comments.ownId, users.id))
    .where(and(eq(comments.adId, adId), isNull(bannedComments.id)))
    .orderBy(desc(comments.createdAt));
}

export async function deleteCommentForUser(
  commentId: number,
  user: AuthUser,
): Promise<{ adId: number } | null> {
  const [comment] = await db
    .select({
      id: comments.id,
      adId: comments.adId,
      ownerId: comments.ownId,
      text: comments.text,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .where(eq(comments.id, commentId));

  if (!comment) {
    return null;
  }

  if (user.userType !== "admin" && comment.ownerId !== user.id) {
    return null;
  }

  const [existingBan] = await db
    .select({ id: bannedComments.id })
    .from(bannedComments)
    .where(eq(bannedComments.commentId, commentId));

  if (!existingBan) {
    await db.insert(bannedComments).values({
      adId: comment.adId,
      commentId: comment.id,
      commentText: comment.text,
      commentOwnerId: comment.ownerId,
      commentCreatedAt: comment.createdAt,
      bannedBy: user.id,
    });
  } else {
    await db
      .update(bannedComments)
      .set({
        commentText: comment.text,
        commentOwnerId: comment.ownerId,
        commentCreatedAt: comment.createdAt,
        bannedBy: user.id,
      })
      .where(eq(bannedComments.id, existingBan.id));
  }

  await db.delete(comments).where(eq(comments.id, commentId));

  return { adId: comment.adId };
}

export async function createCommentForAd({
  adId,
  userId,
  text,
}: {
  adId: number;
  userId: number;
  text: string;
}): Promise<void> {
  const [ad] = await db.select({ id: ads.id }).from(ads).where(eq(ads.id, adId));
  if (!ad) {
    throw new Error("Ad not found.");
  }

  await db.insert(comments).values({
    adId,
    ownId: userId,
    text,
  });
}

export async function getDeletedComments(): Promise<DeletedComment[]> {
  const commentOwners = alias(users, "comment_owners");
  const bannedByUsers = alias(users, "banned_by_users");

  return db
    .select({
      id: bannedComments.id,
      originalCommentId: bannedComments.commentId,
      adId: bannedComments.adId,
      adName: ads.name,
      adModel: ads.model,
      commentText: sql<string>`COALESCE(${bannedComments.commentText}, '')`,
      commentOwnerId: bannedComments.commentOwnerId,
      commentOwnerName: commentOwners.name,
      commentCreatedAt: bannedComments.commentCreatedAt,
      bannedAt: bannedComments.bannedAt,
      bannedByName: bannedByUsers.name,
    })
    .from(bannedComments)
    .innerJoin(ads, eq(bannedComments.adId, ads.id))
    .leftJoin(commentOwners, eq(bannedComments.commentOwnerId, commentOwners.id))
    .innerJoin(bannedByUsers, eq(bannedComments.bannedBy, bannedByUsers.id))
    .orderBy(desc(bannedComments.bannedAt), desc(bannedComments.id));
}

export async function restoreDeletedComment(
  bannedCommentId: number,
): Promise<{ adId: number } | null> {
  const [deletedComment] = await db
    .select({
      id: bannedComments.id,
      adId: bannedComments.adId,
      commentText: bannedComments.commentText,
      commentOwnerId: bannedComments.commentOwnerId,
      commentCreatedAt: bannedComments.commentCreatedAt,
    })
    .from(bannedComments)
    .where(eq(bannedComments.id, bannedCommentId));

  if (
    !deletedComment ||
    !deletedComment.commentText ||
    !deletedComment.commentOwnerId
  ) {
    return null;
  }

  await db.insert(comments).values({
    adId: deletedComment.adId,
    ownId: deletedComment.commentOwnerId,
    text: deletedComment.commentText,
    createdAt: deletedComment.commentCreatedAt ?? new Date(),
  });

  await db.delete(bannedComments).where(eq(bannedComments.id, bannedCommentId));

  return { adId: deletedComment.adId };
}
