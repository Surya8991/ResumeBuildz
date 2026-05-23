ALTER TABLE "profiles" ADD COLUMN "last_seen_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "inactive_warned_at" timestamp;--> statement-breakpoint
-- Backfill: give every existing account a fresh activity timestamp so the
-- inactivity cron doesn't flag long-standing users the moment it ships.
UPDATE "profiles" SET "last_seen_at" = now() WHERE "last_seen_at" IS NULL;