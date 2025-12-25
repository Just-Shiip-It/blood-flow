import { ELIGIBILITY, MIN_DONATION_INTERVAL_DAYS } from "@/lib/constants";
import type { User, Donation } from "@/types";

export type EligibilityCheck = {
  eligible: boolean;
  reasons: string[];
};

export function checkDonorEligibility(
  donor: User,
  lastDonation?: Donation | null
): EligibilityCheck {
  const reasons: string[] = [];

  // Check age
  if (donor.dateOfBirth) {
    const age = calculateAge(new Date(donor.dateOfBirth));
    if (age < ELIGIBILITY.minAge) {
      reasons.push(`Must be at least ${ELIGIBILITY.minAge} years old`);
    }
    if (age > ELIGIBILITY.maxAge) {
      reasons.push(`Must be under ${ELIGIBILITY.maxAge} years old`);
    }
  }

  // Check last donation interval
  if (lastDonation?.donatedAt) {
    const daysSinceLastDonation = daysBetween(
      new Date(lastDonation.donatedAt),
      new Date()
    );
    if (daysSinceLastDonation < MIN_DONATION_INTERVAL_DAYS) {
      const daysRemaining = MIN_DONATION_INTERVAL_DAYS - daysSinceLastDonation;
      reasons.push(`Must wait ${daysRemaining} more days before donating again`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export function checkVitalsEligibility(vitals: {
  temperature: number;
  pulseRate: number;
  systolicBP: number;
  diastolicBP: number;
  hemoglobin: number;
  weight: number;
}): EligibilityCheck {
  const reasons: string[] = [];

  if (vitals.weight < ELIGIBILITY.minWeight) {
    reasons.push(`Weight must be at least ${ELIGIBILITY.minWeight} kg`);
  }

  if (vitals.hemoglobin < ELIGIBILITY.minHemoglobin) {
    reasons.push(`Hemoglobin must be at least ${ELIGIBILITY.minHemoglobin} g/dL`);
  }

  if (vitals.temperature < ELIGIBILITY.minTemperature || vitals.temperature > ELIGIBILITY.maxTemperature) {
    reasons.push(`Temperature must be between ${ELIGIBILITY.minTemperature}°C and ${ELIGIBILITY.maxTemperature}°C`);
  }

  if (vitals.pulseRate < ELIGIBILITY.minPulse || vitals.pulseRate > ELIGIBILITY.maxPulse) {
    reasons.push(`Pulse rate must be between ${ELIGIBILITY.minPulse} and ${ELIGIBILITY.maxPulse} bpm`);
  }

  if (vitals.systolicBP < ELIGIBILITY.minSystolicBP || vitals.systolicBP > ELIGIBILITY.maxSystolicBP) {
    reasons.push(`Systolic BP must be between ${ELIGIBILITY.minSystolicBP} and ${ELIGIBILITY.maxSystolicBP} mmHg`);
  }

  if (vitals.diastolicBP < ELIGIBILITY.minDiastolicBP || vitals.diastolicBP > ELIGIBILITY.maxDiastolicBP) {
    reasons.push(`Diastolic BP must be between ${ELIGIBILITY.minDiastolicBP} and ${ELIGIBILITY.maxDiastolicBP} mmHg`);
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
