ALTER TABLE "staff" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "staff" CASCADE;--> statement-breakpoint
ALTER TABLE "donations" DROP CONSTRAINT "donations_staffId_staff_id_fk";
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "centerId" uuid;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "processedBy" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_centerId_donation_centers_id_fk" FOREIGN KEY ("centerId") REFERENCES "public"."donation_centers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_processedBy_user_id_fk" FOREIGN KEY ("processedBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" DROP COLUMN "staffId";