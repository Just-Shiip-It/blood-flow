"use server";

import { db } from "@/db";
import { user, donationCenters, appointments, donations, queries } from "@/db/schema";
import { eq, sql, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSystemStats() {
  const [donorCount] = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, "donor"));

  const [centerCount] = await db
    .select({ count: count() })
    .from(donationCenters)
    .where(eq(donationCenters.isActive, true));

  const [donationCount] = await db
    .select({ count: count() })
    .from(donations)
    .where(eq(donations.status, "completed"));

  const [pendingQueries] = await db
    .select({ count: count() })
    .from(queries)
    .where(eq(queries.status, "pending"));

  return {
    totalDonors: donorCount?.count || 0,
    activeCenters: centerCount?.count || 0,
    totalDonations: donationCount?.count || 0,
    pendingQueries: pendingQueries?.count || 0,
  };
}

export async function getAllDonationCenters() {
  return db.select().from(donationCenters).orderBy(donationCenters.name);
}

export async function createDonationCenter(data: {
  name: string;
  type: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  latitude?: string;
  longitude?: string;
  operatingHours?: Record<string, string>;
}) {
  const [center] = await db
    .insert(donationCenters)
    .values({
      name: data.name,
      type: data.type,
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email,
      latitude: data.latitude,
      longitude: data.longitude,
      operatingHours: data.operatingHours,
    })
    .returning();

  revalidatePath("/admin/centers");

  return center;
}

export async function updateDonationCenter(
  centerId: string,
  data: Partial<{
    name: string;
    type: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    isActive: boolean;
    operatingHours: Record<string, string>;
  }>
) {
  const [updated] = await db
    .update(donationCenters)
    .set(data)
    .where(eq(donationCenters.id, centerId))
    .returning();

  revalidatePath("/admin/centers");

  return updated;
}

export async function getAllUsers(role?: string) {
  if (role) {
    return db.select().from(user).where(eq(user.role, role as "donor" | "staff" | "admin")).orderBy(desc(user.createdAt));
  }
  return db.select().from(user).orderBy(desc(user.createdAt));
}

export async function updateUserRole(userId: string, newRole: string) {
  const [updated] = await db
    .update(user)
    .set({ role: newRole as "donor" | "staff" | "admin", updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning();

  revalidatePath("/admin/users");

  return updated;
}

export async function verifyUser(userId: string) {
  const [updated] = await db
    .update(user)
    .set({ isVerified: true, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning();

  revalidatePath("/admin/users");

  return updated;
}

export async function getPendingQueries() {
  return db
    .select()
    .from(queries)
    .innerJoin(user, eq(queries.userId, user.id))
    .where(eq(queries.status, "pending"))
    .orderBy(queries.createdAt);
}

export async function resolveQuery(queryId: string, response: string) {
  const [updated] = await db
    .update(queries)
    .set({
      status: "resolved",
      response: response,
      resolvedAt: new Date(),
    })
    .where(eq(queries.id, queryId))
    .returning();

  revalidatePath("/admin/queries");

  return updated;
}
