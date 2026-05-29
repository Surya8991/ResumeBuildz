CREATE TABLE "webhook_events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profiles_last_seen_at_idx" ON "profiles" USING btree ("last_seen_at");--> statement-breakpoint
CREATE INDEX "profiles_inactive_warned_at_idx" ON "profiles" USING btree ("inactive_warned_at");--> statement-breakpoint
CREATE INDEX "profiles_notify_product_idx" ON "profiles" USING btree ("notify_product");--> statement-breakpoint
CREATE INDEX "profiles_stripe_customer_id_idx" ON "profiles" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "user_created_at_idx" ON "user" USING btree ("created_at");