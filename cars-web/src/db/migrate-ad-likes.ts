import { sql } from "drizzle-orm";
import { db } from "./index";

async function migrateAdLikes() {
  console.log("Migrating ad likes...");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "ad_likes" (
      "id" serial PRIMARY KEY,
      "ad_id" integer NOT NULL REFERENCES "ads"("id") ON DELETE cascade,
      "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
      "created_at" timestamp DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "ad_likes_user_ad_unique"
    ON "ad_likes" ("user_id", "ad_id");
  `);

  await db.execute(sql`
    UPDATE "ads"
    SET "likes" = 0
    WHERE "likes" IS NULL;
  `);

  console.log("Ad likes migration complete.");
}

migrateAdLikes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Ad likes migration failed:", error);
    process.exit(1);
  });
