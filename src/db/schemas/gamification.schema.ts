import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const badges = pgTable("badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const queries = pgTable("queries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["pending", "resolved"] }).default("pending").notNull(),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});
