"use client";

import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  ClipboardList, 
  Heart,
  LayoutDashboard,
  Menu,
  X,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/hospital/dashboard", icon: LayoutDashboard },
  { name: "Today's Queue", href: "/hospital/queue", icon: Users },
  { name: "Process Donor", href: "/hospital/process", icon: ClipboardList },
];

export function HospitalLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white dark:bg-slate-900 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 border-b bg-primary text-primary-foreground">
          <Heart className="h-6 w-6" />
          <div>
            <span className="text-xl font-bold tracking-tighter">Vitals</span>
            <p className="text-xs opacity-80">Hospital Portal</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
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
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-primary text-primary-foreground sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tighter">Vitals</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
            <div 
              className="w-64 h-full bg-white dark:bg-slate-900" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex items-center gap-2 border-b bg-primary text-primary-foreground">
                <Heart className="h-6 w-6" />
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
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
