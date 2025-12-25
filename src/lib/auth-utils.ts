import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { UserRole } from "./constants";

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function checkRole(allowedRoles: UserRole[]) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  
  if (!user.role || !allowedRoles.includes(user.role as UserRole)) {
    redirect("/unauthorized"); // Or dashboard
  }
  
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}
