import { pgTable, text, timestamp, boolean, uuid, decimal, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const donationCenters = pgTable("donation_centers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // center, hospital, camp
  address: text("address").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  operatingHours: jsonb("operatingHours"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const staff = pgTable("staff", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  centerId: uuid("centerId").notNull().references(() => donationCenters.id),
  position: text("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
