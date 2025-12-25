import { TIME_SLOTS } from "@/lib/constants";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function getAvailableSlots(centerId: string, date: Date): Promise<string[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookedSlots = await db
    .select({ timeSlot: appointments.timeSlot })
    .from(appointments)
    .where(
      and(
        eq(appointments.centerId, centerId),
        sql`${appointments.scheduledDate} >= ${startOfDay}`,
        sql`${appointments.scheduledDate} <= ${endOfDay}`,
        sql`${appointments.status} NOT IN ('cancelled', 'missed')`
      )
    );

  const bookedSet = new Set(bookedSlots.map((s) => s.timeSlot));
  
  return TIME_SLOTS.filter((slot) => !bookedSet.has(slot));
}

export function formatTimeSlot(slot: string): string {
  const [hours, minutes] = slot.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getNextAvailableDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  // Skip weekends
  while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }
  
  return tomorrow;
}
