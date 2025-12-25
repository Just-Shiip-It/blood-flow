"use client";

import { useAuth } from "@/hooks/use-auth";
import { 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  Heart,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Centers", href: "/admin/centers", icon: Building2 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Queries", href: "/admin/queries", icon: HelpCircle },
];

export function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-900 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-2 border-b border-slate-800">
          <Heart className="h-6 w-6 text-primary" />
          <div>
            <span className="text-xl font-bold tracking-tighter">Vitals</span>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden h-16 flex items-center justify-between px-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tighter">Vitals</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
            <div 
              className="w-64 h-full bg-slate-900" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex items-center gap-2 border-b border-slate-800">
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
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
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
