CREATE TABLE IF NOT EXISTS "multiplayer_score" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"room_id" text NOT NULL,
	"participant_id" text NOT NULL,
	"wpm" integer NOT NULL,
	"raw_wpm" integer NOT NULL,
	"accuracy" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multiplayer_score" ADD CONSTRAINT "multiplayer_score_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multiplayer_score" ADD CONSTRAINT "multiplayer_score_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "multiplayer_score" ADD CONSTRAINT "multiplayer_score_participant_id_participant_id_fk" FOREIGN KEY ("participant_id") REFERENCES "participant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
