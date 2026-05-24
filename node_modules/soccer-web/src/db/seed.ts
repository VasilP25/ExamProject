import bcrypt from "bcrypt";
import { db } from "./index";
import { users, ads, comments, bannedComments } from "./schema";

const usersData = [
  {
    email: "steve@gmail.com",
    password: "password123",
    name: "Steve",
    userType: "normal",
  },
  {
    email: "peter@gmail.com",
    password: "password123",
    name: "Peter",
    userType: "admin",
  },
  {
    email: "dave@gmail.com",
    password: "password123",
    name: "Dave",
    userType: "normal",
  },
  {
    email: "john@gmail.com",
    password: "password123",
    name: "John",
    userType: "normal",
  },
  {
    email: "nick@gmail.com",
    password: "password123",
    name: "Nick",
    userType: "normal",
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    email: `user${index + 1}@gmail.com`,
    password: "password123",
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

  const adsData = [
    {
      name: "Ford",
      model: "Focus",
      year: 2012,
      picture: "https://example.com/images/ford-focus-2012.jpg",
      ownId: emailToId["steve@gmail.com"],
      likes: 5,
    },
    {
      name: "Toyota",
      model: "Corolla",
      year: 2013,
      picture: "https://example.com/images/toyota-corolla-2013.jpg",
      ownId: emailToId["peter@gmail.com"],
      likes: 8,
    },
  ];

  const insertedAds = await db
    .insert(ads)
    .values(adsData)
    .returning({ id: ads.id, name: ads.name });
  const adNameToId = Object.fromEntries(
    insertedAds.map((ad) => [ad.name, ad.id]),
  );

  const commentsData = [
    {
      text: "Some comment about the car.",
      ownId: emailToId["dave@gmail.com"],
      adId: adNameToId["Ford"],
      createdAt: new Date("2026-05-20T10:00:00Z"),
    },
    {
      text: "Some comment that mentions the model.",
      ownId: emailToId["john@gmail.com"],
      adId: adNameToId["Toyota"],
      createdAt: new Date("2026-05-21T14:30:00Z"),
    },
    {
      text: "Some comment from another user.",
      ownId: emailToId["nick@gmail.com"],
      adId: adNameToId["Ford"],
      createdAt: new Date("2026-05-22T09:15:00Z"),
    },
  ];

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
