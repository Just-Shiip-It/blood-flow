import { pgTable, text, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { donationCenters } from "./center.schema";

// Better Auth Tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  
  // Custom fields for Vitals
  role: text("role", { enum: ["donor", "center", "admin"] }).default("donor").notNull(),
  centerId: uuid("centerId").references(() => donationCenters.id),
  bloodType: text("bloodType", { enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] }),
  dateOfBirth: timestamp("dateOfBirth"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  citizenId: text("citizenId").unique(),
  isVerified: boolean("isVerified").default(false).notNull(),
  
  // Donor stats
  lastDonationDate: timestamp("lastDonationDate"),
  totalDonations: integer("totalDonations").default(0).notNull(),
});


export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});
