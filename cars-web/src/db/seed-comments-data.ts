import { seedAdsData } from "./seed-ads-data";

export type SeedCommentData = {
  adName: string;
  adModel: string;
  adYear: number;
  ownerEmail: string;
  text: string;
  createdAt: Date;
};

const commenterEmails = [
  "dave@gmail.com",
  "john@gmail.com",
  "nick@gmail.com",
  "user1@gmail.com",
  "user2@gmail.com",
  "user3@gmail.com",
  "user4@gmail.com",
  "user5@gmail.com",
  "user6@gmail.com",
  "user7@gmail.com",
  "user8@gmail.com",
  "user9@gmail.com",
];

const commentTemplates = [
  (label: string) =>
    `Looks clean for the year. I would just check the service history on this ${label}.`,
  (label: string) =>
    `Nice spec. The interior and paint condition would be the main things I would inspect on the ${label}.`,
  (label: string) =>
    `Good option for daily driving. If the mileage is reasonable, this ${label} should get interest quickly.`,
];

export const seedCommentsData: SeedCommentData[] = seedAdsData.flatMap(
  (ad, adIndex) => {
    const label = `${ad.name} ${ad.model}`;
    const commentCount = adIndex % 3 === 0 ? 2 : 3;

    return Array.from({ length: commentCount }, (_, commentIndex) => ({
      adName: ad.name,
      adModel: ad.model,
      adYear: ad.year,
      ownerEmail:
        commenterEmails[(adIndex + commentIndex) % commenterEmails.length],
      text: commentTemplates[commentIndex](label),
      createdAt: new Date(
        Date.UTC(2026, 4, 1 + adIndex, 9 + commentIndex, 20),
      ),
    }));
  },
);
