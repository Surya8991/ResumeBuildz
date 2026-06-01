ALTER TABLE "profiles" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "managed_by" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_managed_by_user_id_fk" FOREIGN KEY ("managed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profiles_managed_by_idx" ON "profiles" USING btree ("managed_by");