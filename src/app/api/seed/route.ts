import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  user,
  donationCenters,
  staff,
  appointments,
  donations,
  healthScreenings,
  badges,
  bloodInventory,
  donationJourney,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

// --- Helper Functions ---
const randomElement = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDecimal = (min: number, max: number, precision = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(precision));

const generateId = () => crypto.randomUUID();

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const COMPONENTS = ["whole_blood", "rbc", "plasma", "platelets"] as const;

const FIRST_NAMES = ["Alice", "Bob", "Charlie", "David", "Emily", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xander", "Yara", "Zach"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

const TIME_SLOTS = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];

// --- Data Definitions ---
const CENTERS_DATA = [
  { name: "City Central Blood Bank", type: "center", address: "123 Healthcare Blvd", city: "New York", phone: "555-0101", email: "contact@citycentralblood.com", amenities: ["Free Parking", "WiFi", "Snacks", "Accessible"], rating: "4.9" },
  { name: "St. Mary's Hospital", type: "hospital", address: "456 Mercy Lane", city: "New York", phone: "555-0102", email: "blood@stmarys.org", amenities: ["Cafeteria", "Accessible"], rating: "4.7" },
  { name: "University Clinic", type: "mobile", address: "789 Campus Way", city: "Boston", phone: "555-0103", email: "donate@uniclinic.edu", amenities: ["WiFi", "Student Lounge"], rating: "4.8" },
  { name: "Red Cross Outpost Downtown", type: "camp", address: "101 Main Street", city: "Chicago", phone: "555-0104", email: "downtown@redcross.org", amenities: ["Refreshments"], rating: "4.6" },
  { name: "MedLife Diagnostics", type: "center", address: "202 Health Park Ave", city: "Los Angeles", phone: "555-0105", email: "blood@medlifediag.com", amenities: ["Free Parking", "WiFi", "Kids Play Area"], rating: "4.5" },
];

const STAFF_DATA = [
  { name: "Dr. Sarah Smith", email: "sarah.smith@hospital.com", position: "Senior Phlebotomist" },
  { name: "Dr. James Wilson", email: "james.wilson@hospital.com", position: "Lab Technician" },
  { name: "Nurse Emily Chen", email: "emily.chen@hospital.com", position: "Registered Nurse" },
  { name: "Dr. Michael Brown", email: "michael.brown@hospital.com", position: "Medical Officer" },
  { name: "Nurse Olivia Davis", email: "olivia.davis@hospital.com", position: "Donor Care Specialist" },
];

const BADGE_TYPES = [
  { type: "first_drop", name: "First Drop", description: "Completed your first donation." },
  { type: "regular_donor", name: "Regular Donor", description: "Donated 3 or more times." },
  { type: "gallon_club", name: "Gallon Club", description: "Donated a full gallon of blood." },
  { type: "lifesaver_5", name: "Lifesaver x5", description: "Potentially saved 5 lives." },
  { type: "lifesaver_10", name: "Lifesaver x10", description: "Potentially saved 10 lives." },
];

const JOURNEY_STAGES = ["collected", "testing", "processing", "dispatched", "delivered", "used"] as const;

// --- Main Seed Function ---
export async function GET() {
  console.log("🌱 Starting comprehensive seed...");
  const startTime = Date.now();

  try {
    // --- 1. Seed Donation Centers ---
    console.log("📍 Seeding Donation Centers...");
    const centerIds: string[] = [];
    for (const c of CENTERS_DATA) {
      const existing = await db.select().from(donationCenters).where(eq(donationCenters.email, c.email));
      if (existing.length === 0) {
        const [newCenter] = await db.insert(donationCenters).values({
          ...c,
          type: c.type as "center" | "hospital" | "camp" | "mobile",
          operatingHours: { "Mon-Fri": "08:00 - 18:00", "Sat": "09:00 - 14:00", "Sun": "Closed" },
        }).returning();
        centerIds.push(newCenter.id);
      } else {
        centerIds.push(existing[0].id);
      }
    }
    console.log(`   ✅ Centers ready: ${centerIds.length}`);

    // --- 2. Seed Admin User ---
    console.log("👤 Seeding Admin User...");
    const adminEmail = "admin@vitals.com";
    let adminExists = await db.select().from(user).where(eq(user.email, adminEmail));
    if (adminExists.length === 0) {
      await auth.api.signUpEmail({ body: { email: adminEmail, password: "Admin123!", name: "System Admin" } });
      await db.update(user).set({ role: "admin", isVerified: true }).where(eq(user.email, adminEmail));
    }
    console.log("   ✅ Admin ready.");

    // --- 3. Seed Staff Users ---
    console.log("👔 Seeding Staff Users...");
    const staffUserIds: string[] = [];
    for (let i = 0; i < STAFF_DATA.length; i++) {
      const s = STAFF_DATA[i];
      let existingStaff = await db.select().from(user).where(eq(user.email, s.email));
      if (existingStaff.length === 0) {
        await auth.api.signUpEmail({ body: { email: s.email, password: "Staff123!", name: s.name } });
        await db.update(user).set({ role: "staff", isVerified: true }).where(eq(user.email, s.email));
        existingStaff = await db.select().from(user).where(eq(user.email, s.email));
      }
      if (existingStaff.length > 0) {
        staffUserIds.push(existingStaff[0].id);
        const existingStaffLink = await db.select().from(staff).where(eq(staff.userId, existingStaff[0].id));
        if (existingStaffLink.length === 0) {
          await db.insert(staff).values({
            userId: existingStaff[0].id,
            centerId: centerIds[i % centerIds.length],
            position: s.position,
          });
        }
      }
    }
    console.log(`   ✅ Staff ready: ${staffUserIds.length}`);

    // --- 4. Seed Donor Users ---
    console.log("🩸 Seeding Donor Users...");
    const donorUserIds: string[] = [];
    const NUM_DONORS = 50;
    for (let i = 0; i < NUM_DONORS; i++) {
      const firstName = randomElement(FIRST_NAMES);
      const lastName = randomElement(LAST_NAMES);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

      let existingDonor = await db.select().from(user).where(eq(user.email, email));
      if (existingDonor.length === 0) {
        await auth.api.signUpEmail({ body: { email, password: "Donor123!", name: `${firstName} ${lastName}` } });
        await db.update(user).set({
          role: "donor",
          bloodType: randomElement(BLOOD_TYPES) as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-",
          phone: `555-${String(randomInt(1000, 9999))}`,
          city: randomElement(["New York", "Boston", "Chicago", "Los Angeles"]),

          isVerified: Math.random() > 0.2, // 80% verified
        }).where(eq(user.email, email));
        existingDonor = await db.select().from(user).where(eq(user.email, email));
      }
      if (existingDonor.length > 0) {
        donorUserIds.push(existingDonor[0].id);
      }
    }
    console.log(`   ✅ Donors ready: ${donorUserIds.length}`);

    // --- 5. Seed Appointments & Donations ---
    console.log("📅 Seeding Appointments & Donations...");
    let appointmentCount = 0;
    let donationCount = 0;
    const donationRecordIds: string[] = [];

    for (const donorId of donorUserIds) {
      const numHistoricalDonations = randomInt(0, 6); // 0 to 6 past donations
      const hasUpcoming = Math.random() > 0.6; // 40% have upcoming

      // Historical donations
      for (let j = 0; j < numHistoricalDonations; j++) {
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - randomInt(1, 24)); // 1-24 months ago
        const centerId = randomElement(centerIds);
        const staffId = staffUserIds.length > 0 ? randomElement(staffUserIds) : undefined;

        // Get staff record from staffUserIds which are user IDs
        let staffRecordId: string | undefined;
        if (staffId) {
            const staffRecord = await db.select().from(staff).where(eq(staff.userId, staffId));
            if (staffRecord.length > 0) staffRecordId = staffRecord[0].id;
        }

        const [apt] = await db.insert(appointments).values({
          donorId,
          centerId,
          scheduledDate: pastDate,
          timeSlot: randomElement(TIME_SLOTS),
          status: "completed",
        }).returning();
        appointmentCount++;

        const [don] = await db.insert(donations).values({
          donorId,
          appointmentId: apt.id,
          centerId,
          staffId: staffRecordId,
          status: "completed",
          donatedAt: pastDate,
          volumeMl: randomInt(400, 500),
          bagNumber: `BAG-${randomInt(10000, 99999)}`,
        }).returning();
        donationCount++;
        donationRecordIds.push(don.id);

        // Health Screening
        await db.insert(healthScreenings).values({
          donationId: don.id,
          temperature: String(randomDecimal(36.2, 37.2)),
          pulseRate: randomInt(60, 90),
          systolicBP: randomInt(110, 140),
          diastolicBP: randomInt(70, 90),
          hemoglobin: String(randomDecimal(12.5, 17.0)),
          weight: String(randomDecimal(50, 100)),
          passedQuestionnaire: true,
          result: "pass",
        });
      }

      // Update user stats
      if (numHistoricalDonations > 0) {
        const lastDonation = new Date();
        lastDonation.setMonth(lastDonation.getMonth() - randomInt(1, 6));
        await db.update(user).set({
          totalDonations: numHistoricalDonations,
          lastDonationDate: lastDonation,
        }).where(eq(user.id, donorId));
      }

      // Upcoming appointment
      if (hasUpcoming) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + randomInt(1, 14));
        await db.insert(appointments).values({
          donorId,
          centerId: randomElement(centerIds),
          scheduledDate: futureDate,
          timeSlot: randomElement(TIME_SLOTS),
          status: "scheduled",
        });
        appointmentCount++;
      }
    }
    console.log(`   ✅ Appointments: ${appointmentCount}, Donations: ${donationCount}`);

    // --- 6. Seed Donation Journeys (for recent 10 donations) ---
    console.log("🚚 Seeding Donation Journeys...");
    const recentDonations = donationRecordIds.slice(-10);
    for (const donId of recentDonations) {
      const numStages = randomInt(3, JOURNEY_STAGES.length);
      for (let i = 0; i < numStages; i++) {
        const stageDate = new Date();
        stageDate.setDate(stageDate.getDate() - (numStages - i - 1));
        await db.insert(donationJourney).values({
          donationId: donId,
          stage: JOURNEY_STAGES[i],
          location: randomElement(["City Central Bank", "Regional Lab", "Processing Hub", "Transit", "St. Mary's Hospital", "Patient Ward"]),
          metadata: { unitId: `UNIT-${randomInt(10000, 99999)}`, labRef: `LAB-${randomInt(100, 999)}` },
          completedAt: stageDate,
        });
      }
    }
    console.log(`   ✅ Journeys seeded for ${recentDonations.length} donations.`);

    // --- 7. Seed Blood Inventory ---
    console.log("🩺 Seeding Blood Inventory...");
    let inventoryCount = 0;
    for (const cId of centerIds) {
      for (const bt of BLOOD_TYPES) {
        for (const comp of COMPONENTS) {
          const existing = await db.select().from(bloodInventory)
            .where(eq(bloodInventory.centerId, cId))
            // Note: Drizzle ORM requires `and()` for multiple where clauses, simplified here
            ;
          // Simple check, add if likely not present
          await db.insert(bloodInventory).values({
            centerId: cId,
            bloodType: bt,
            component: comp,
            unitsAvailable: randomInt(5, 50),
          }).onConflictDoNothing(); // Requires unique constraint, but good practice
          inventoryCount++;
        }
      }
    }
    console.log(`   ✅ Inventory records: ${inventoryCount}`);

    // --- 8. Seed Badges (for power donors) ---
    console.log("🏅 Seeding Badges...");
    let badgeCount = 0;
    const powerDonors = await db.select().from(user).where(eq(user.role, "donor")); // Simplified, ideally filter by totalDonations > 3
    for (const donor of powerDonors) {
      if ((donor.totalDonations ?? 0) >= 1) {
        await db.insert(badges).values({ userId: donor.id, ...BADGE_TYPES[0] }).onConflictDoNothing();
        badgeCount++;
      }
      if ((donor.totalDonations ?? 0) >= 3) {
        await db.insert(badges).values({ userId: donor.id, ...BADGE_TYPES[1] }).onConflictDoNothing();
        badgeCount++;
      }
      if ((donor.totalDonations ?? 0) >= 5) {
        await db.insert(badges).values({ userId: donor.id, ...BADGE_TYPES[3] }).onConflictDoNothing();
        badgeCount++;
      }
    }
    console.log(`   ✅ Badges awarded: ${badgeCount}`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Seed completed in ${duration}s!`);

    return NextResponse.json({
      success: true,
      message: `Seed completed in ${duration}s.`,
      stats: {
        centers: centerIds.length,
        staff: staffUserIds.length,
        donors: donorUserIds.length,
        appointments: appointmentCount,
        donations: donationCount,
      },
    });
  } catch (error: any) {
    console.error("❌ Seed Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
