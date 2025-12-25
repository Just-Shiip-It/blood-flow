CREATE TABLE "blood_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"centerId" uuid NOT NULL,
	"bloodType" text NOT NULL,
	"component" text NOT NULL,
	"units_available" integer DEFAULT 0 NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donation_journey" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"donationId" uuid NOT NULL,
	"stage" text NOT NULL,
	"location" text,
	"notes" text,
	"metadata" jsonb,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "lastDonationDate" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "totalDonations" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "donation_centers" ADD COLUMN "amenities" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "donation_centers" ADD COLUMN "rating" numeric DEFAULT '4.5';--> statement-breakpoint
ALTER TABLE "blood_inventory" ADD CONSTRAINT "blood_inventory_centerId_donation_centers_id_fk" FOREIGN KEY ("centerId") REFERENCES "public"."donation_centers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donation_journey" ADD CONSTRAINT "donation_journey_donationId_donations_id_fk" FOREIGN KEY ("donationId") REFERENCES "public"."donations"("id") ON DELETE no action ON UPDATE no action;