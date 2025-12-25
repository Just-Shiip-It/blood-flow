"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Heart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-border">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tighter">Vitals</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join our community and start saving lives today.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(signUp)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <input
                {...register("name")}
                className={cn(
                  "w-full px-4 py-2 rounded-lg border bg-background outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  errors.name && "border-destructive focus:ring-destructive/20"
                )}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Email address</label>
              <input
                {...register("email")}
                type="email"
                className={cn(
                  "w-full px-4 py-2 rounded-lg border bg-background outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  errors.email && "border-destructive focus:ring-destructive/20"
                )}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <input
                {...register("password")}
                type="password"
                className={cn(
                  "w-full px-4 py-2 rounded-lg border bg-background outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  errors.password && "border-destructive focus:ring-destructive/20"
                )}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
