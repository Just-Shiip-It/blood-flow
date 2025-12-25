import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { donationCenters } from "./center.schema";

/**
 * Blood Inventory Schema
 * Tracks available blood units per center, blood type, and component.
 */
export const bloodInventory = pgTable("blood_inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  centerId: uuid("centerId").notNull().references(() => donationCenters.id),
  bloodType: text("bloodType", { enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] }).notNull(),
  component: text("component", { enum: ["whole_blood", "rbc", "plasma", "platelets"] }).notNull(),
  unitsAvailable: integer("units_available").default(0).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});
