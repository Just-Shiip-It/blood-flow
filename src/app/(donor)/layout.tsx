import React from "react";
import { DonorLayoutShell } from "@/components/layouts/donor-layout-shell";
import { requireAuth } from "@/lib/auth-utils";

export default async function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user is authenticated
  await requireAuth();
  
  // Note: We don't strict-check "donor" role here because admins/staff 
  // might want to view the donor dashboard for testing or debugging.
  // But typically checking for authenticated user is enough for the generic "user" area.

  return (
    <DonorLayoutShell>
      {children}
    </DonorLayoutShell>
  );
}
