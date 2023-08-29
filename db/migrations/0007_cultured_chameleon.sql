CREATE TABLE IF NOT EXISTS "room" (
	"id" text PRIMARY KEY NOT NULL,
	"creator_id" text NOT NULL,
	"room_name" text NOT NULL,
	"mode" text NOT NULL,
	"amount" integer NOT NULL,
	"is_public_room" boolean DEFAULT true NOT NULL,
	"max_users" integer NOT NULL,
	"min_wpm" integer DEFAULT 0 NOT NULL,
	"is_active_room" boolean DEFAULT true,
	"participants_ids" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_active_room_idx" ON "room" ("is_active_room");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room" ADD CONSTRAINT "room_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
