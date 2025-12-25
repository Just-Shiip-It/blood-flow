import React from "react";
import { HospitalLayoutShell } from "@/components/layouts/hospital-layout-shell";
import { checkRole } from "@/lib/auth-utils";
import { UserRole } from "@/lib/constants";

export default async function HospitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user is authenticated and has staff or admin role
  await checkRole([UserRole.STAFF, UserRole.ADMIN]);

  return (
    <HospitalLayoutShell>
      {children}
    </HospitalLayoutShell>
  );
}
