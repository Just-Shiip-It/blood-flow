import { pgTable, text, timestamp, boolean, uuid, decimal, jsonb } from "drizzle-orm/pg-core";

export const donationCenters = pgTable("donation_centers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["center", "hospital", "camp", "mobile"] }).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  operatingHours: jsonb("operatingHours"),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  rating: decimal("rating").default("4.5"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

