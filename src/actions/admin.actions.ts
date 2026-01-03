"use server";

import { db } from "@/db";
import { user, donationCenters, donations, appointments } from "@/db/schema";
import { eq, sql, desc, and, gte, lte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// --- Types ---
export type AdminDashboardStats = {
  totalDonors: number;
  totalDonations: number;
  activeCenters: number;
  appointmentsThisMonth: number;
  totalVolumeMl: number;
  pendingAppointments: number;
  completedAppointments: number;
};

export type FacilityItem = typeof donationCenters.$inferSelect;
export type UserItem = Pick<typeof user.$inferSelect, "id" | "name" | "email" | "role" | "bloodType" | "isVerified" | "createdAt" | "totalDonations">;

// --- Helper to get current admin user ---
async function getCurrentAdminUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const [dbUser] = await db.select().from(user).where(eq(user.id, session.user.id));
  if (!dbUser || dbUser.role !== "admin") return null;

  return dbUser;
}

// --- Admin Actions ---

export async function getAdminDashboard(): Promise<AdminDashboardStats | null> {
  const admin = await getCurrentAdminUser();
  if (!admin) return null;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [donorCount] = await db.select({ count: sql<number>`count(*)` }).from(user).where(eq(user.role, "donor"));
  const [donationCount] = await db.select({ count: sql<number>`count(*)` }).from(donations);
  const [centerCount] = await db.select({ count: sql<number>`count(*)` }).from(donationCenters).where(eq(donationCenters.isActive, true));
  const [apptCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(gte(appointments.createdAt, startOfMonth));

  // Total volume from all donations (in ml)
  const [volumeSum] = await db.select({ total: sql<number>`COALESCE(SUM(volume_ml), 0)` }).from(donations);
  
  // Pending appointments (scheduled status)
  const [pendingCount] = await db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.status, "scheduled"));
  
  // Completed appointments
  const [completedCount] = await db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.status, "completed"));

  return {
    totalDonors: Number(donorCount?.count ?? 0),
    totalDonations: Number(donationCount?.count ?? 0),
    activeCenters: Number(centerCount?.count ?? 0),
    appointmentsThisMonth: Number(apptCount?.count ?? 0),
    totalVolumeMl: Number(volumeSum?.total ?? 0),
    pendingAppointments: Number(pendingCount?.count ?? 0),
    completedAppointments: Number(completedCount?.count ?? 0),
  };
}

export async function getAllFacilities(): Promise<FacilityItem[]> {
  const admin = await getCurrentAdminUser();
  if (!admin) return [];

  return db.select().from(donationCenters).orderBy(donationCenters.name);
}

export type CenterStats = {
  id: string;
  name: string;
  city: string;
  appointmentCount: number;
  donationCount: number;
  isActive: boolean;
};

export async function getCenterStats(): Promise<CenterStats[]> {
  const admin = await getCurrentAdminUser();
  if (!admin) return [];

  const centers = await db.select().from(donationCenters);
  
  const centerStats = await Promise.all(centers.map(async (center) => {
    const [aptCount] = await db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.centerId, center.id));
    const [donCount] = await db.select({ count: sql<number>`count(*)` }).from(donations).where(eq(donations.centerId, center.id));
    
    return {
      id: center.id,
      name: center.name,
      city: center.city,
      appointmentCount: Number(aptCount?.count ?? 0),
      donationCount: Number(donCount?.count ?? 0),
      isActive: center.isActive,
    };
  }));
  
  return centerStats;
}

export async function toggleFacilityStatus(centerId: string, isActive: boolean) {
  const admin = await getCurrentAdminUser();
  if (!admin) throw new Error("Unauthorized");

  await db.update(donationCenters).set({ isActive }).where(eq(donationCenters.id, centerId));

  return { success: true };
}

export async function getAllUsers(roleFilter?: string): Promise<UserItem[]> {
  const admin = await getCurrentAdminUser();
  if (!admin) return [];

  let query = db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodType: user.bloodType,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      totalDonations: user.totalDonations,
    })
    .from(user)
    .orderBy(desc(user.createdAt))
    .$dynamic();

  if (roleFilter && roleFilter !== "All") {
    query = query.where(eq(user.role, roleFilter.toLowerCase() as "donor" | "center" | "admin"));
  }

  return query.limit(100);
}

export async function updateUserRole(userId: string, newRole: "donor" | "center" | "admin") {
  const admin = await getCurrentAdminUser();
  if (!admin) throw new Error("Unauthorized");

  await db.update(user).set({ role: newRole }).where(eq(user.id, userId));

  return { success: true };
}

export async function verifyUser(userId: string, isVerified: boolean) {
  const admin = await getCurrentAdminUser();
  if (!admin) throw new Error("Unauthorized");

  await db.update(user).set({ isVerified }).where(eq(user.id, userId));

  return { success: true };
}
