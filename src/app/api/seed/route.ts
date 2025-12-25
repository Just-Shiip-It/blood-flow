import { NextResponse } from "next/server";
import { db } from "@/db";
import { user, donationCenters, staff } from "@/db/schema";
import { auth } from "@/lib/auth"; // Better Auth server instance
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // 1. Create Admin User
    const adminEmail = "admin@vitals.com";
    const existingAdmin = await db.select().from(user).where(eq(user.email, adminEmail));

    if (existingAdmin.length === 0) {
      // Use Better Auth API to create user with password hashing
      // We'll create as normal user first, then upgrade role
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: "Admin123!",
          name: "System Admin",
        },
      });

      // Update role to admin
      await db.update(user).set({ role: "admin" }).where(eq(user.email, adminEmail));
      console.log("Admin user created.");
    }

    // 2. Create Central Hospital
    const centerEmail = "contact@centralhospital.com";
    let centerId: string;
    const existingCenter = await db.select().from(donationCenters).where(eq(donationCenters.email, centerEmail));

    if (existingCenter.length === 0) {
      const [newCenter] = await db.insert(donationCenters).values({
        name: "Central City Hospital",
        type: "hospital",
        address: "123 Healthcare Blvd",
        city: "Metropolis",
        phone: "555-0123",
        email: centerEmail,
        operatingHours: {
            "Monday": "08:00 - 18:00",
            "Tuesday": "08:00 - 18:00",
            "Wednesday": "08:00 - 18:00",
            "Thursday": "08:00 - 18:00",
            "Friday": "08:00 - 18:00",
            "Saturday": "09:00 - 14:00",
            "Sunday": "Closed"
        },
        isActive: true,
      }).returning();
      centerId = newCenter.id;
      console.log("Central Hospital created.");
    } else {
      centerId = existingCenter[0].id;
    }

    // 3. Create Staff User
    const staffEmail = "staff@hospital.com";
    const existingStaffUser = await db.select().from(user).where(eq(user.email, staffEmail));

    if (existingStaffUser.length === 0) {
      const staffUserResponse = await auth.api.signUpEmail({
        body: {
          email: staffEmail,
          password: "Staff123!",
          name: "Dr. Sarah Smith",
        },
      });
      
      // Update role to staff
      // Note: 'signUpEmail' returns headers/body, but we just query DB to be sure or use returned user if accessible. 
      // Querying by email is safest here as API return type might vary.
      await db.update(user).set({ role: "staff" }).where(eq(user.email, staffEmail));
      
      // Link to Staff table
      const staffUser = await db.select().from(user).where(eq(user.email, staffEmail));
      if (staffUser.length > 0) {
        await db.insert(staff).values({
           userId: staffUser[0].id,
           centerId: centerId,
           position: "Senior Phlebotomist",
        });
      }
      console.log("Staff user created.");
    }

    return NextResponse.json({ success: true, message: "Seed completed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
