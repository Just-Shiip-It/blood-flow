// Blood type options
export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodType = (typeof BLOOD_TYPES)[number];

// Appointment statuses
export const APPOINTMENT_STATUSES = ["scheduled", "checked_in", "screening", "donating", "completed", "cancelled", "missed"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

// Donation statuses
export const DONATION_STATUSES = ["processing", "completed", "rejected"] as const;
export type DonationStatus = (typeof DONATION_STATUSES)[number];

// User roles
export const UserRole = {
  ADMIN: "admin",
  CENTER: "center",
  DONOR: "donor",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLES = [UserRole.DONOR, UserRole.CENTER, UserRole.ADMIN] as const;

// Health screening result
export const SCREENING_RESULTS = ["pass", "fail", "deferred"] as const;
export type ScreeningResult = (typeof SCREENING_RESULTS)[number];

// Center types
export const CENTER_TYPES = ["hospital", "blood_bank", "camp"] as const;
export type CenterType = (typeof CENTER_TYPES)[number];

// Time slots (30-minute intervals, 8 AM - 6 PM)
export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30"
] as const;

// Minimum days between donations
export const MIN_DONATION_INTERVAL_DAYS = 56;

// Minimum eligibility criteria
export const ELIGIBILITY = {
  minAge: 18,
  maxAge: 65,
  minWeight: 50, // kg
  minHemoglobin: 12.5, // g/dL
  minTemperature: 36.1, // °C
  maxTemperature: 37.5,
  minPulse: 50,
  maxPulse: 100,
  minSystolicBP: 90,
  maxSystolicBP: 180,
  minDiastolicBP: 60,
  maxDiastolicBP: 100,
} as const;
