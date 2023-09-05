ALTER TABLE "multiplayer_score" DROP CONSTRAINT "multiplayer_score_participant_id_participant_id_fk";
--> statement-breakpoint
ALTER TABLE "multiplayer_score" DROP COLUMN IF EXISTS "participant_id";