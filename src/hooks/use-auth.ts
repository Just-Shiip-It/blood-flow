"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { User } from "@/types";
import { UserRole } from "@/lib/constants";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending, error } = authClient.useSession();

  const signUp = async (values: any) => {
    setIsLoading(true);
    try {
      const resp = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      if (resp.error) throw resp.error;
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (values: any) => {
    setIsLoading(true);
    try {
      const resp = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (resp.error) throw resp.error;
      
      // Fetch session to check role for redirect
      const sessionData = await authClient.getSession();
      const user = sessionData.data?.user as User | undefined;
      const userRole = user?.role;
      
      switch(userRole) {
        case UserRole.ADMIN:
          router.push("/admin");
          break;
        case UserRole.CENTER:
          router.push("/hospital/dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return {
    session,
    user: session?.user as User | undefined,
    isLoading: isLoading || isPending,
    error,
    signUp,
    signIn,
    signOut,
  };
}
