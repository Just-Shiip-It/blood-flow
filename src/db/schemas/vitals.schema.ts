import { pgTable, text, timestamp, boolean, integer, uuid, decimal, jsonb } from "drizzle-orm/pg-core";
import { donations } from "./appointment.schema";

export const healthScreenings = pgTable("health_screenings", {
  id: uuid("id").defaultRandom().primaryKey(),
  donationId: uuid("donationId").notNull().references(() => donations.id),
  temperature: decimal("temperature"),
  pulseRate: integer("pulse_rate"),
  systolicBP: integer("systolic_bp"),
  diastolicBP: integer("diastolic_bp"),
  hemoglobin: decimal("hemoglobin"),
  weight: decimal("weight"),
  passedQuestionnaire: boolean("passed_questionnaire").notNull(),
  questionnaireAnswers: jsonb("questionnaire_answers"),
  result: text("result", { enum: ["pass", "fail"] }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
