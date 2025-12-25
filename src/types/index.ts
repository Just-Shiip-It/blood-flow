import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as schema from "@/db/schema";

// User types
export type User = InferSelectModel<typeof schema.user>;
export type NewUser = InferInsertModel<typeof schema.user>;

// Session types
export type Session = InferSelectModel<typeof schema.session>;

// Donation Center types
export type DonationCenter = InferSelectModel<typeof schema.donationCenters>;
export type NewDonationCenter = InferInsertModel<typeof schema.donationCenters>;

// Appointment types
export type Appointment = InferSelectModel<typeof schema.appointments>;
export type NewAppointment = InferInsertModel<typeof schema.appointments>;

// Donation types
export type Donation = InferSelectModel<typeof schema.donations>;
export type NewDonation = InferInsertModel<typeof schema.donations>;

// Health Screening types
export type HealthScreening = InferSelectModel<typeof schema.healthScreenings>;
export type NewHealthScreening = InferInsertModel<typeof schema.healthScreenings>;

// Badge types
export type Badge = InferSelectModel<typeof schema.badges>;

// Query types
export type Query = InferSelectModel<typeof schema.queries>;

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Appointment with relations
export type AppointmentWithDetails = Appointment & {
  center: DonationCenter;
  donor: User;
};

export type AppointmentWithCenter = Appointment & {
  center: DonationCenter;
};

// Donation with relations
export type DonationWithDetails = Donation & {
  appointment: Appointment | null;
  center: DonationCenter;
  screening: HealthScreening | null;
  donor: User;
};

export type DonationWithCenter = Donation & {
  center: DonationCenter;
};
