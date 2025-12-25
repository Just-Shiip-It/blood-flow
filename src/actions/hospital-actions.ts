"use server";

import { db } from "@/db";
import { appointments, donations, healthScreenings, donationCenters, user } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTodaysAppointments(centerId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const result = await db
    .select()
    .from(appointments)
    .innerJoin(user, eq(appointments.donorId, user.id))
    .where(
      and(
        eq(appointments.centerId, centerId),
        sql`${appointments.scheduledDate} >= ${today}`,
        sql`${appointments.scheduledDate} < ${tomorrow}`
      )
    )
    .orderBy(appointments.scheduledDate);

  return result.map((row) => ({
    ...row.appointments,
    donor: row.user,
  }));
}

export async function checkInDonor(appointmentId: string) {
  const [updated] = await db
    .update(appointments)
    .set({ status: "checked_in", updatedAt: new Date() })
    .where(eq(appointments.id, appointmentId))
    .returning();

  revalidatePath("/hospital/dashboard");

  return updated;
}

export async function recordHealthScreening(data: {
  donationId: string;
  temperature: number;
  pulseRate: number;
  systolicBP: number;
  diastolicBP: number;
  hemoglobin: number;
  weight: number;
  passedQuestionnaire: boolean;
  questionnaireAnswers?: Record<string, boolean>;
  result: "pass" | "fail";
  notes?: string;
}) {
  const [screening] = await db
    .insert(healthScreenings)
    .values({
      donationId: data.donationId,
      temperature: String(data.temperature),
      pulseRate: data.pulseRate,
      systolicBP: data.systolicBP,
      diastolicBP: data.diastolicBP,
      hemoglobin: String(data.hemoglobin),
      weight: String(data.weight),
      passedQuestionnaire: data.passedQuestionnaire,
      questionnaireAnswers: data.questionnaireAnswers,
      result: data.result,
      notes: data.notes,
    })
    .returning();

  return screening;
}

export async function startDonation(appointmentId: string, centerId: string, staffId?: string) {
  const [appt] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId));

  if (!appt) throw new Error("Appointment not found");

  const [donation] = await db
    .insert(donations)
    .values({
      donorId: appt.donorId,
      appointmentId: appointmentId,
      centerId: centerId,
      staffId: staffId,
      status: "processing",
    })
    .returning();

  await db
    .update(appointments)
    .set({ status: "donating", updatedAt: new Date() })
    .where(eq(appointments.id, appointmentId));

  revalidatePath("/hospital/dashboard");

  return donation;
}

export async function completeDonation(
  donationId: string,
  data: {
    volumeMl: number;
    bagNumber: string;
    notes?: string;
  }
) {
  const [donation] = await db
    .update(donations)
    .set({
      status: "completed",
      volumeMl: data.volumeMl,
      bagNumber: data.bagNumber,
      notes: data.notes,
      donatedAt: new Date(),
    })
    .where(eq(donations.id, donationId))
    .returning();

  if (donation.appointmentId) {
    await db
      .update(appointments)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(appointments.id, donation.appointmentId));
  }

  revalidatePath("/hospital/dashboard");

  return donation;
}

export async function rejectDonation(donationId: string, reason: string) {
  const [donation] = await db
    .update(donations)
    .set({ status: "rejected", notes: reason })
    .where(eq(donations.id, donationId))
    .returning();

  if (donation.appointmentId) {
    await db
      .update(appointments)
      .set({ status: "completed", updatedAt: new Date() })
      .where(eq(appointments.id, donation.appointmentId));
  }

  revalidatePath("/hospital/dashboard");

  return donation;
}

export async function getDonorByIdOrEmail(query: string) {
  const result = await db
    .select()
    .from(user)
    .where(
      sql`${user.citizenId} = ${query} OR ${user.email} = ${query}`
    )
    .limit(1);

  return result[0] || null;
}
