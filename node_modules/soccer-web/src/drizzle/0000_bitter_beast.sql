CREATE TABLE "ads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"model" varchar(255) NOT NULL,
	"year" integer NOT NULL,
	"picture" text,
	"own_id" integer NOT NULL,
	"likes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "banned_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"ad_id" integer NOT NULL,
	"comment_id" integer NOT NULL,
	"banned_at" timestamp DEFAULT now(),
	"banned_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"own_id" integer NOT NULL,
	"ad_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_own_id_users_id_fk" FOREIGN KEY ("own_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banned_comments" ADD CONSTRAINT "banned_comments_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banned_comments" ADD CONSTRAINT "banned_comments_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banned_comments" ADD CONSTRAINT "banned_comments_banned_by_users_id_fk" FOREIGN KEY ("banned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_own_id_users_id_fk" FOREIGN KEY ("own_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_ad_id_ads_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."ads"("id") ON DELETE cascade ON UPDATE no action;