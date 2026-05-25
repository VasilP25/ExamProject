import { sql } from "drizzle-orm";
import { db } from "./index";

async function migrateBannedCommentsArchive() {
  console.log("Migrating banned_comments archive columns...");

  await db.execute(sql`
    ALTER TABLE "banned_comments"
    ADD COLUMN IF NOT EXISTS "comment_text" text;
  `);

  await db.execute(sql`
    ALTER TABLE "banned_comments"
    ADD COLUMN IF NOT EXISTS "comment_owner_id" integer;
  `);

  await db.execute(sql`
    ALTER TABLE "banned_comments"
    ADD COLUMN IF NOT EXISTS "comment_created_at" timestamp;
  `);

  await db.execute(sql`
    UPDATE "banned_comments"
    SET
      "comment_text" = COALESCE("banned_comments"."comment_text", "comments"."text"),
      "comment_owner_id" = COALESCE("banned_comments"."comment_owner_id", "comments"."own_id"),
      "comment_created_at" = COALESCE("banned_comments"."comment_created_at", "comments"."created_at")
    FROM "comments"
    WHERE "banned_comments"."comment_id" = "comments"."id";
  `);

  await db.execute(sql`
    ALTER TABLE "banned_comments"
    DROP CONSTRAINT IF EXISTS "banned_comments_comment_id_comments_id_fk";
  `);

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'banned_comments_comment_owner_id_users_id_fk'
      ) THEN
        ALTER TABLE "banned_comments"
        ADD CONSTRAINT "banned_comments_comment_owner_id_users_id_fk"
        FOREIGN KEY ("comment_owner_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;
      END IF;
    END $$;
  `);

  console.log("banned_comments archive migration complete.");
}

migrateBannedCommentsArchive()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("banned_comments archive migration failed:", error);
    process.exit(1);
  });
