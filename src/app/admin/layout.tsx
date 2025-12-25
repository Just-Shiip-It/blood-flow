import React from "react";
import { AdminLayoutShell } from "@/components/layouts/admin-layout-shell";
import { checkRole } from "@/lib/auth-utils";
import { UserRole } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user is authenticated and has admin role
  await checkRole([UserRole.ADMIN]);

  return (
    <AdminLayoutShell>
      {children}
    </AdminLayoutShell>
  );
}
