import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  userType: varchar("user_type", { length: 50 }).notNull(), // 'admin', 'user'
  createdAt: timestamp("created_at").defaultNow(),
});

// Ads table
export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull().default(0),
  description: text("description").notNull().default(""),
  picture: text("picture"), // URL or path to picture
  ownId: integer("own_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ad likes table
export const adLikes = pgTable(
  "ad_likes",
  {
    id: serial("id").primaryKey(),
    adId: integer("ad_id")
      .notNull()
      .references(() => ads.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uniqueUserAdLike: uniqueIndex("ad_likes_user_ad_unique").on(
      table.userId,
      table.adId,
    ),
  }),
);

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  ownId: integer("own_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  adId: integer("ad_id")
    .notNull()
    .references(() => ads.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Banned comments table
export const bannedComments = pgTable("banned_comments", {
  id: serial("id").primaryKey(),
  adId: integer("ad_id")
    .notNull()
    .references(() => ads.id, { onDelete: "cascade" }),
  commentId: integer("comment_id").notNull(),
  commentText: text("comment_text"),
  commentOwnerId: integer("comment_owner_id").references(() => users.id),
  commentCreatedAt: timestamp("comment_created_at"),
  bannedAt: timestamp("banned_at").defaultNow(),
  bannedBy: integer("banned_by")
    .notNull()
    .references(() => users.id), // admin who banned it
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ads: many(ads),
  comments: many(comments),
  adLikes: many(adLikes),
  bannedComments: many(bannedComments),
}));

export const adsRelations = relations(ads, ({ one, many }) => ({
  owner: one(users, { fields: [ads.ownId], references: [users.id] }),
  comments: many(comments),
  adLikes: many(adLikes),
  bannedComments: many(bannedComments),
}));

export const adLikesRelations = relations(adLikes, ({ one }) => ({
  ad: one(ads, { fields: [adLikes.adId], references: [ads.id] }),
  user: one(users, { fields: [adLikes.userId], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  owner: one(users, { fields: [comments.ownId], references: [users.id] }),
  ad: one(ads, { fields: [comments.adId], references: [ads.id] }),
  bannedRecord: many(bannedComments),
}));

export const bannedCommentsRelations = relations(bannedComments, ({ one }) => ({
  ad: one(ads, { fields: [bannedComments.adId], references: [ads.id] }),
  commentOwner: one(users, {
    fields: [bannedComments.commentOwnerId],
    references: [users.id],
  }),
  bannedByUser: one(users, {
    fields: [bannedComments.bannedBy],
    references: [users.id],
  }),
}));
