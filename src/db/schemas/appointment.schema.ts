import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { donationCenters, staff } from "./center.schema";

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  donorId: text("donorId").notNull().references(() => user.id),
  centerId: uuid("centerId").notNull().references(() => donationCenters.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  timeSlot: text("time_slot").notNull(),
  status: text("status", { enum: ["scheduled", "checked_in", "donating", "completed", "cancelled", "missed"] }).default("scheduled").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const donations = pgTable("donations", {
  id: uuid("id").defaultRandom().primaryKey(),
  donorId: text("donorId").notNull().references(() => user.id),
  appointmentId: uuid("appointmentId").references(() => appointments.id),
  centerId: uuid("centerId").notNull().references(() => donationCenters.id),
  staffId: uuid("staffId").references(() => staff.id),
  status: text("status", { enum: ["processing", "completed", "rejected"] }).default("processing").notNull(),
  donatedAt: timestamp("donated_at"),
  volumeMl: integer("volume_ml"),
  bagNumber: text("bag_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
