ALTER TABLE "participant" DROP COLUMN IF EXISTS "id";
ALTER TABLE "participant" ADD PRIMARY KEY ("user_id");--> statement-breakpoint