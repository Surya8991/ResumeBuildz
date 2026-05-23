CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"ai_rewrites_used" integer DEFAULT 0 NOT NULL,
	"ai_rewrites_reset_date" text,
	"pdf_exports_used" integer DEFAULT 0 NOT NULL,
	"pdf_exports_reset_date" text,
	"headline" text,
	"current_role" text,
	"years_experience" integer,
	"timezone" text,
	"locale" text,
	"target_role" text,
	"target_seniority" text,
	"target_industry" text,
	"target_locations" text,
	"open_to_work" boolean,
	"default_template" text,
	"default_font" text,
	"default_accent" text,
	"default_language" text,
	"mask_phone_on_share" boolean,
	"linkedin_url" text,
	"github_url" text,
	"portfolio_url" text,
	"notify_ats_tips" boolean,
	"notify_product" boolean,
	"invoice_email" text,
	"stripe_customer_id" text
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"user_id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"source" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;