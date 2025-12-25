"use server";

import { db } from "@/db";
import { user, appointments, donations, donationCenters } from "@/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUpcomingAppointments(donorId: string) {
  const now = new Date();
  
  const result = await db
    .select()
    .from(appointments)
    .innerJoin(donationCenters, eq(appointments.centerId, donationCenters.id))
    .where(
      and(
        eq(appointments.donorId, donorId),
        eq(appointments.status, "scheduled"),
        gte(appointments.scheduledDate, now)
      )
    )
    .orderBy(appointments.scheduledDate);

  return result.map((row) => ({
    ...row.appointments,
    center: row.donation_centers,
  }));
}

export async function getDonationHistory(donorId: string) {
  const result = await db
    .select()
    .from(donations)
    .innerJoin(donationCenters, eq(donations.centerId, donationCenters.id))
    .where(eq(donations.donorId, donorId))
    .orderBy(desc(donations.createdAt));

  return result.map((row) => ({
    ...row.donations,
    center: row.donation_centers,
  }));
}

export async function bookAppointment(data: {
  donorId: string;
  centerId: string;
  scheduledDate: Date;
  timeSlot: string;
}) {
  const [appointment] = await db
    .insert(appointments)
    .values({
      donorId: data.donorId,
      centerId: data.centerId,
      scheduledDate: data.scheduledDate,
      timeSlot: data.timeSlot,
      status: "scheduled",
    })
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/appointments");

  return appointment;
}

export async function cancelAppointment(appointmentId: string, donorId: string) {
  const [updated] = await db
    .update(appointments)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(
      and(
        eq(appointments.id, appointmentId),
        eq(appointments.donorId, donorId)
      )
    )
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/appointments");

  return updated;
}

export async function rescheduleAppointment(
  appointmentId: string,
  donorId: string,
  newDate: Date,
  newTimeSlot: string
) {
  const [updated] = await db
    .update(appointments)
    .set({
      scheduledDate: newDate,
      timeSlot: newTimeSlot,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(appointments.id, appointmentId),
        eq(appointments.donorId, donorId)
      )
    )
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/appointments");

  return updated;
}

import { type BloodType } from "@/lib/constants";

export async function updateDonorProfile(
  donorId: string,
  data: {
    name?: string;
    phone?: string;
    bloodType?: string;
    address?: string;
    city?: string;
    citizenId?: string;
  }
) {
  const [updated] = await db
    .update(user)
    .set({ 
      ...data, 
      bloodType: data.bloodType as BloodType | undefined,
      updatedAt: new Date() 
    })
    .where(eq(user.id, donorId))
    .returning();

  revalidatePath("/profile");

  return updated;
}

export async function getNearbyDonationCenters(city?: string) {
  if (city) {
    return db
      .select()
      .from(donationCenters)
      .where(and(eq(donationCenters.city, city), eq(donationCenters.isActive, true)));
  }
  
  return db.select().from(donationCenters).where(eq(donationCenters.isActive, true));
}
