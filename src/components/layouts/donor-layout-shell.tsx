"use client";

import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  Calendar, 
  History, 
  User, 
  Settings, 
  LogOut, 
  Heart,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "History", href: "/history", icon: History },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Donation Card", href: "/card", icon: ShieldCheck },
];

export function DonorLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut, user } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white dark:bg-slate-900 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 border-b">
          <Heart className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tighter">Vitals</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-slate-900 border-b sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter">Vitals</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
            <div 
              className="w-64 h-full bg-white dark:bg-slate-900 animate-slide-in-left" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex items-center gap-2 border-b">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-tighter">Vitals</span>
              </div>
              <nav className="p-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-secondary hover:text-primary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <header className="mb-8 hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Donor'}!</h1>
              <p className="text-muted-foreground">Here's an overview of your donation activity.</p>
            </div>
            <div className="flex items-center gap-4">
               {/* User Avatar Placeholder */}
               <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                 {user?.name?.[0] || 'D'}
               </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
