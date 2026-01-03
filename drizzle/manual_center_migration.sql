-- Manual migration to add center-based authentication
-- Run this in your database console (e.g., Neon dashboard SQL Editor)

-- 1. Drop the staff table (CASCADE will handle dependencies)
DROP TABLE IF EXISTS "staff" CASCADE;

-- 2. Add centerId column to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "centerId" uuid;

-- 3. Add processedBy column to donations table
ALTER TABLE "donations" ADD COLUMN IF NOT EXISTS "processedBy" text;

-- 4. Drop staffId column from donations if it exists
ALTER TABLE "donations" DROP COLUMN IF EXISTS "staffId";

-- 5. Add foreign key for user.centerId -> donation_centers.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_centerId_donation_centers_id_fk'
  ) THEN
    ALTER TABLE "user" ADD CONSTRAINT "user_centerId_donation_centers_id_fk" 
    FOREIGN KEY ("centerId") REFERENCES "public"."donation_centers"("id") 
    ON DELETE no action ON UPDATE no action;
  END IF;
END $$;

-- 6. Add foreign key for donations.processedBy -> user.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'donations_processedBy_user_id_fk'
  ) THEN
    ALTER TABLE "donations" ADD CONSTRAINT "donations_processedBy_user_id_fk" 
    FOREIGN KEY ("processedBy") REFERENCES "public"."user"("id") 
    ON DELETE no action ON UPDATE no action;
  END IF;
END $$;
