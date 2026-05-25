import bcrypt from "bcrypt";
import { db } from "./index";
import { users, ads, comments, bannedComments } from "./schema";
import {
  getSeedAdDescription,
  getSeedAdPrice,
  seedAdsData,
} from "./seed-ads-data";
import { seedCommentsData } from "./seed-comments-data";

const usersData = [
  {
    email: "steve@gmail.com",
    password: "pass123",
    name: "Steve",
    userType: "normal",
  },
  {
    email: "peter@gmail.com",
    password: "pass123",
    name: "Peter",
    userType: "admin",
  },
  {
    email: "dave@gmail.com",
    password: "pass123",
    name: "Dave",
    userType: "normal",
  },
  {
    email: "john@gmail.com",
    password: "pass123",
    name: "John",
    userType: "normal",
  },
  {
    email: "nick@gmail.com",
    password: "pass123",
    name: "Nick",
    userType: "normal",
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    email: `user${index + 1}@gmail.com`,
    password: "pass123",
    name: `User ${index + 1}`,
    userType: "normal",
  })),
];

async function seed() {
  console.log("Seeding database...");

  await db.delete(bannedComments).execute();
  await db.delete(comments).execute();
  await db.delete(ads).execute();
  await db.delete(users).execute();

  const usersWithPasswordHashes = await Promise.all(
    usersData.map(async ({ password, ...user }) => ({
      ...user,
      passwordHash: await bcrypt.hash(password, 10),
    })),
  );

  const insertedUsers = await db
    .insert(users)
    .values(usersWithPasswordHashes)
    .returning({ id: users.id, email: users.email });

  const emailToId = Object.fromEntries(
    insertedUsers.map((user) => [user.email, user.id]),
  );

  const adsData = seedAdsData.map(({ ownerEmail, ...ad }) => ({
    ...ad,
    price: ad.price ?? getSeedAdPrice(ad),
    description: ad.description ?? getSeedAdDescription(ad),
    ownId: emailToId[ownerEmail],
  }));

  const insertedAds = await db
    .insert(ads)
    .values(adsData)
    .returning({ id: ads.id, name: ads.name, model: ads.model, year: ads.year });
  const adNameToId = Object.fromEntries(
    insertedAds.map((ad) => [ad.name, ad.id]),
  );
  const adKeyToId = Object.fromEntries(
    insertedAds.map((ad) => [`${ad.name}:${ad.model}:${ad.year}`, ad.id]),
  );

  const commentsData = seedCommentsData.map((comment) => ({
    text: comment.text,
    ownId: emailToId[comment.ownerEmail],
    adId: adKeyToId[
      `${comment.adName}:${comment.adModel}:${comment.adYear}`
    ],
    createdAt: comment.createdAt,
  }));

  const insertedComments = await db
    .insert(comments)
    .values(commentsData)
    .returning({ id: comments.id, adId: comments.adId });

  const [firstComment, secondComment] = insertedComments;

  const bannedCommentsData = [
    {
      adId: adNameToId["Ford"],
      commentId: firstComment.id,
      bannedBy: emailToId["peter@gmail.com"],
    },
    {
      adId: adNameToId["Toyota"],
      commentId: secondComment.id,
      bannedBy: emailToId["peter@gmail.com"],
    },
  ];

  await db.insert(bannedComments).values(bannedCommentsData).execute();

  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
