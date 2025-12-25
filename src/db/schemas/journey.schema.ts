import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { donations } from "./appointment.schema";

/**
 * Donation Journey Schema
 * Tracks the lifecycle of a donation unit from collection to transfusion.
 */
export const donationJourney = pgTable("donation_journey", {
  id: uuid("id").defaultRandom().primaryKey(),
  donationId: uuid("donationId").notNull().references(() => donations.id),
  stage: text("stage", { 
    enum: ["collected", "testing", "processing", "dispatched", "delivered", "used"] 
  }).notNull(),
  location: text("location"),
  notes: text("notes"),
  metadata: jsonb("metadata").$type<Record<string, string>>(), // e.g., { "unitId": "...", "labRef": "..." }
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});
