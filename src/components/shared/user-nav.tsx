"use client";

import { useAuth } from "@/hooks/use-auth";
import { 
  CreditCard, 
  LogOut, 
  Settings, 
  User,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function UserNav() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <Button asChild size="sm">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-secondary/50 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
          {user.name?.[0] || "U"}
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 z-50">
            <div className="p-4 border-b">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <div className="p-2 space-y-1">
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary rounded-lg transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary rounded-lg transition-colors"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link 
                href="/settings" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
            <div className="p-2 border-t">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
