"use server";

import { db } from "@/db";
import {
  user,
  appointments,
  donations,
  healthScreenings,
  donationCenters,
  donationJourney,
  badges,
} from "@/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// --- Types ---
export type DonorDashboardData = {
  user: typeof user.$inferSelect;
  upcomingAppointment: (typeof appointments.$inferSelect & { center: typeof donationCenters.$inferSelect }) | null;
  stats: { totalDonations: number; livesSaved: number; lastDonation: Date | null };
};

export type DonationHistoryItem = typeof donations.$inferSelect & {
  center: typeof donationCenters.$inferSelect;
  screening: typeof healthScreenings.$inferSelect | null;
};

export type VitalsHistoryItem = {
  date: Date;
  hemoglobin: number | null;
  bpSystolic: number | null;
  bpDiastolic: number | null;
  pulse: number | null;
  weight: number | null;
};

export type CenterOption = {
  id: string;
  name: string;
  address: string;
  city: string;
  type: string;
  amenities: string[];
  rating: string;
};

// --- Helper to get current user ---
async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;
  const [dbUser] = await db.select().from(user).where(eq(user.id, session.user.id));
  return dbUser;
}

// --- Donor Actions ---

export async function getDonorDashboard(): Promise<DonorDashboardData | null> {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "donor") return null;

  // Get upcoming appointment
  const [upcoming] = await db
    .select()
    .from(appointments)
    .innerJoin(donationCenters, eq(appointments.centerId, donationCenters.id))
    .where(and(eq(appointments.donorId, currentUser.id), eq(appointments.status, "scheduled"), gte(appointments.scheduledDate, new Date())))
    .orderBy(appointments.scheduledDate)
    .limit(1);

  return {
    user: currentUser,
    upcomingAppointment: upcoming ? { ...upcoming.appointments, center: upcoming.donation_centers } : null,
    stats: {
      totalDonations: currentUser.totalDonations ?? 0,
      livesSaved: (currentUser.totalDonations ?? 0) * 3,
      lastDonation: currentUser.lastDonationDate,
    },
  };
}

export async function getDonationHistory(): Promise<DonationHistoryItem[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const history = await db
    .select()
    .from(donations)
    .innerJoin(donationCenters, eq(donations.centerId, donationCenters.id))
    .leftJoin(healthScreenings, eq(healthScreenings.donationId, donations.id))
    .where(eq(donations.donorId, currentUser.id))
    .orderBy(desc(donations.donatedAt));

  return history.map((h) => ({
    ...h.donations,
    center: h.donation_centers,
    screening: h.health_screenings,
  }));
}

export async function getVitalsHistory(): Promise<VitalsHistoryItem[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const donationsWithScreenings = await db
    .select({
      donatedAt: donations.donatedAt,
      hemoglobin: healthScreenings.hemoglobin,
      systolicBP: healthScreenings.systolicBP,
      diastolicBP: healthScreenings.diastolicBP,
      pulseRate: healthScreenings.pulseRate,
      weight: healthScreenings.weight,
    })
    .from(donations)
    .innerJoin(healthScreenings, eq(healthScreenings.donationId, donations.id))
    .where(eq(donations.donorId, currentUser.id))
    .orderBy(donations.donatedAt);

  return donationsWithScreenings.map((d) => ({
    date: d.donatedAt ?? new Date(),
    hemoglobin: d.hemoglobin ? parseFloat(d.hemoglobin) : null,
    bpSystolic: d.systolicBP,
    bpDiastolic: d.diastolicBP,
    pulse: d.pulseRate,
    weight: d.weight ? parseFloat(d.weight) : null,
  }));
}

export async function getDonationJourney(donationId: string) {
  const journey = await db
    .select()
    .from(donationJourney)
    .where(eq(donationJourney.donationId, donationId))
    .orderBy(donationJourney.completedAt);
  return journey;
}

export async function getLatestDonationWithJourney() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const [latestDonation] = await db
    .select()
    .from(donations)
    .where(and(eq(donations.donorId, currentUser.id), eq(donations.status, "completed")))
    .orderBy(desc(donations.donatedAt))
    .limit(1);

  if (!latestDonation) return null;

  const journey = await getDonationJourney(latestDonation.id);
  return { donation: latestDonation, journey };
}

export async function getDonorBadges() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];
  return db.select().from(badges).where(eq(badges.userId, currentUser.id)).orderBy(desc(badges.earnedAt));
}

// --- Center Actions ---

export async function getCenters(): Promise<CenterOption[]> {
  const centers = await db.select().from(donationCenters).where(eq(donationCenters.isActive, true));
  return centers.map((c) => ({
    id: c.id,
    name: c.name,
    address: c.address,
    city: c.city,
    type: c.type,
    amenities: (c.amenities as string[]) ?? [],
    rating: c.rating ?? "4.5",
  }));
}

export async function scheduleAppointment(data: { centerId: string; scheduledDate: Date; timeSlot: string }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  const [newAppointment] = await db
    .insert(appointments)
    .values({
      donorId: currentUser.id,
      centerId: data.centerId,
      scheduledDate: data.scheduledDate,
      timeSlot: data.timeSlot,
      status: "scheduled",
    })
    .returning();

  return newAppointment;
}

export async function cancelAppointment(appointmentId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  await db
    .update(appointments)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(and(eq(appointments.id, appointmentId), eq(appointments.donorId, currentUser.id)));

  return { success: true };
}
