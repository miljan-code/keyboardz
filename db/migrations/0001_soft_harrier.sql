CREATE TABLE IF NOT EXISTS "test" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"wpm" integer NOT NULL,
	"raw_wpm" integer NOT NULL,
	"test_type" text NOT NULL,
	"test_type_amount" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "test" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "test" ADD CONSTRAINT "test_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
