"use server";

import { db } from "@/db";
import {
  user,
  appointments,
  donations,
  healthScreenings,
  donationCenters,
  bloodInventory,
} from "@/db/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// --- Types ---
export type HospitalDashboardStats = {
  todaysAppointments: number;
  pendingScreenings: number;
  completedToday: number;
  criticalInventory: number;
  totalAppointments: number;
  totalDonations: number;
  weekDonations: number;
};

export type AppointmentWithDonor = typeof appointments.$inferSelect & {
  donor: Pick<typeof user.$inferSelect, "id" | "name" | "bloodType" | "phone">;
};

export type InventoryItem = typeof bloodInventory.$inferSelect;

// --- Helper to get current center user and their center ---
async function getCurrentCenterUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const [dbUser] = await db.select().from(user).where(eq(user.id, session.user.id));
  if (!dbUser || dbUser.role !== "center" || !dbUser.centerId) return null;

  return { user: dbUser, centerId: dbUser.centerId };
}

// --- Hospital Actions ---

export async function getHospitalDashboard(): Promise<{ stats: HospitalDashboardStats; center: typeof donationCenters.$inferSelect } | null> {
  const centerData = await getCurrentCenterUser();
  if (!centerData) return null;

  const { centerId } = centerData;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [center] = await db.select().from(donationCenters).where(eq(donationCenters.id, centerId));

  // Today's appointments
  const todaysAppts = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(and(eq(appointments.centerId, centerId), gte(appointments.scheduledDate, today), lte(appointments.scheduledDate, tomorrow)));

  // Pending screenings (checked_in status)
  const pending = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(and(eq(appointments.centerId, centerId), eq(appointments.status, "checked_in")));

  // Completed today
  const completed = await db
    .select({ count: sql<number>`count(*)` })
    .from(donations)
    .where(and(eq(donations.centerId, centerId), eq(donations.status, "completed"), gte(donations.donatedAt, today)));

  // Critical inventory (units < 10)
  const critical = await db
    .select({ count: sql<number>`count(*)` })
    .from(bloodInventory)
    .where(and(eq(bloodInventory.centerId, centerId), lte(bloodInventory.unitsAvailable, 10)));

  // Total appointments for this center (all time)
  const totalAppts = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(eq(appointments.centerId, centerId));

  // Total donations for this center (all time)
  const totalDons = await db
    .select({ count: sql<number>`count(*)` })
    .from(donations)
    .where(and(eq(donations.centerId, centerId), eq(donations.status, "completed")));

  // Donations this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekDons = await db
    .select({ count: sql<number>`count(*)` })
    .from(donations)
    .where(and(eq(donations.centerId, centerId), eq(donations.status, "completed"), gte(donations.donatedAt, weekAgo)));

  return {
    center,
    stats: {
      todaysAppointments: Number(todaysAppts[0]?.count ?? 0),
      pendingScreenings: Number(pending[0]?.count ?? 0),
      completedToday: Number(completed[0]?.count ?? 0),
      criticalInventory: Number(critical[0]?.count ?? 0),
      totalAppointments: Number(totalAppts[0]?.count ?? 0),
      totalDonations: Number(totalDons[0]?.count ?? 0),
      weekDonations: Number(weekDons[0]?.count ?? 0),
    },
  };
}

export async function getHospitalAppointments(statusFilter?: string): Promise<AppointmentWithDonor[]> {
  const centerData = await getCurrentCenterUser();
  if (!centerData) return [];

  const { centerId } = centerData;

  let query = db
    .select({
      appointments,
      user: { id: user.id, name: user.name, bloodType: user.bloodType, phone: user.phone },
    })
    .from(appointments)
    .innerJoin(user, eq(appointments.donorId, user.id))
    .where(eq(appointments.centerId, centerId))
    .orderBy(desc(appointments.scheduledDate))
    .$dynamic();

  if (statusFilter && statusFilter !== "All") {
    // @ts-ignore - dynamic status filter
    query = query.where(eq(appointments.status, statusFilter.toLowerCase().replace("-", "_")));
  }

  const results = await query.limit(50);

  return results.map((r) => ({
    ...r.appointments,
    donor: r.user as Pick<typeof user.$inferSelect, "id" | "name" | "bloodType" | "phone">,
  }));
}

export async function updateAppointmentStatus(appointmentId: string, newStatus: "scheduled" | "checked_in" | "donating" | "completed" | "cancelled" | "missed") {
  const centerData = await getCurrentCenterUser();
  if (!centerData) throw new Error("Unauthorized");

  const { centerId, user: centerUser } = centerData;

  // Get the appointment to find the donor
  const [appointment] = await db.select().from(appointments).where(eq(appointments.id, appointmentId));
  if (!appointment) throw new Error("Appointment not found");

  // If checking in, treat it as a completed donation
  if (newStatus === "checked_in") {
    // Mark appointment as completed
    await db.update(appointments).set({ status: "completed", updatedAt: new Date() }).where(eq(appointments.id, appointmentId));

    // Create donation record
    await db.insert(donations).values({
      donorId: appointment.donorId,
      appointmentId: appointmentId,
      centerId,
      processedBy: centerUser.id,
      status: "completed",
      donatedAt: new Date(),
      volumeMl: 450,
      bagNumber: `BAG-${Date.now()}`,
    });

    // Update donor's lastDonationDate and increment totalDonations
    await db.update(user)
      .set({ 
        lastDonationDate: new Date(), 
        totalDonations: sql`${user.totalDonations} + 1`,
        updatedAt: new Date()
      })
      .where(eq(user.id, appointment.donorId));

    return { success: true, message: "Donation completed and donor history updated" };
  }

  // For other status changes, just update the status
  await db.update(appointments).set({ status: newStatus, updatedAt: new Date() }).where(eq(appointments.id, appointmentId));

  return { success: true };
}

export async function createScreeningAndDonation(data: {
  appointmentId: string;
  donorId: string;
  screening: {
    temperature: number;
    pulseRate: number;
    systolicBP: number;
    diastolicBP: number;
    hemoglobin: number;
    weight: number;
    notes?: string;
  };
}) {
  const centerData = await getCurrentCenterUser();
  if (!centerData) throw new Error("Unauthorized");

  const { centerId, user: centerUser } = centerData;

  // Create donation record
  const [donation] = await db
    .insert(donations)
    .values({
      donorId: data.donorId,
      appointmentId: data.appointmentId,
      centerId,
      processedBy: centerUser.id,
      status: "completed",
      donatedAt: new Date(),
      volumeMl: 450,
      bagNumber: `BAG-${Date.now()}`,
    })
    .returning();

  // Create health screening
  await db.insert(healthScreenings).values({
    donationId: donation.id,
    temperature: String(data.screening.temperature),
    pulseRate: data.screening.pulseRate,
    systolicBP: data.screening.systolicBP,
    diastolicBP: data.screening.diastolicBP,
    hemoglobin: String(data.screening.hemoglobin),
    weight: String(data.screening.weight),
    passedQuestionnaire: true,
    result: "pass",
    notes: data.screening.notes,
  });

  // Update appointment status
  await db.update(appointments).set({ status: "completed", updatedAt: new Date() }).where(eq(appointments.id, data.appointmentId));

  // Update donor stats
  const [donorRecord] = await db.select().from(user).where(eq(user.id, data.donorId));
  await db
    .update(user)
    .set({
      totalDonations: (donorRecord?.totalDonations ?? 0) + 1,
      lastDonationDate: new Date(),
    })
    .where(eq(user.id, data.donorId));

  return { success: true, donationId: donation.id };
}

export async function getHospitalInventory(): Promise<InventoryItem[]> {
  const centerData = await getCurrentCenterUser();
  if (!centerData) return [];

  return db.select().from(bloodInventory).where(eq(bloodInventory.centerId, centerData.centerId)).orderBy(bloodInventory.bloodType);
}

export async function updateInventoryUnits(inventoryId: string, newUnits: number) {
  const centerData = await getCurrentCenterUser();
  if (!centerData) throw new Error("Unauthorized");

  await db.update(bloodInventory).set({ unitsAvailable: newUnits, lastUpdated: new Date() }).where(eq(bloodInventory.id, inventoryId));

  return { success: true };
}
