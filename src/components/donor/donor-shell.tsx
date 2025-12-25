"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Activity, 
  Droplet,
  LogOut,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function DonorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, href: '/schedule' },
    { id: 'impact', label: 'My Impact', icon: Droplet, href: '/impact' },
    { id: 'wellness', label: 'Wellness', icon: Activity, href: '/wellness' },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-stone-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-20 rounded-r-3xl my-4 ml-4 mb-4 relative">
        <div className="p-8 pb-4">
          <Link href="/" className="flex items-center gap-3 text-rose-600 font-bold text-2xl font-serif tracking-tight">
            <div className="bg-rose-50 p-2.5 rounded-2xl">
               <Droplet className="fill-current w-6 h-6" />
            </div>
            LifeFlow
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = pathname === item.href;
             return (
              <Link 
                key={item.id}
                href={item.href}
                className={cn(
                  "relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-medium transition-all duration-300 group",
                  isActive 
                    ? 'text-rose-600 bg-rose-50/80' 
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                )}
              >
                {isActive && (
                    <motion.div 
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-r-full"
                    />
                )}
                <Icon size={22} className={cn("transition-transform duration-300", isActive ? 'scale-110 stroke-[2.5px]' : 'group-hover:scale-110')} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </Link>
             );
          })}
        </nav>

        <div className="p-6 border-t border-stone-100">
           <div className="flex items-center gap-3 mb-4 p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-default">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-rose-100 to-orange-100 text-rose-800 flex items-center justify-center font-bold font-serif shadow-inner border border-white shrink-0">
                 {user.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                 <p className="font-bold text-sm text-stone-900 truncate font-serif">{user.name}</p>
                 <p className="text-xs text-stone-400 truncate font-medium">Donor Account</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium group"
           >
             <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-30 px-4 py-3 flex items-center justify-between md:hidden">
            <Link href="/" className="flex items-center gap-2 text-rose-600 font-bold text-lg font-serif">
                <div className="bg-rose-50 p-1.5 rounded-lg">
                    <Droplet className="fill-current w-4 h-4" />
                </div>
                LifeFlow
            </Link>
            <div className="flex items-center gap-2">
                 <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-stone-500 bg-stone-50 rounded-full">
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                 </button>
            </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-16 left-0 w-full bg-white z-20 shadow-xl rounded-b-3xl border-b border-stone-100 md:hidden p-4"
                >
                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium",
                                    pathname === item.href ? 'bg-rose-50 text-rose-600' : 'text-stone-600'
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        ))}
                        <div className="h-px bg-stone-100 my-2" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 font-medium">
                            <LogOut size={20} /> Sign Out
                        </button>
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="max-w-5xl mx-auto p-4 pb-24 md:p-8 lg:p-12">
               {children}
            </div>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="md:hidden absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-stone-100 pb-safe z-40 rounded-t-3xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
           <div className="flex justify-around items-center h-20 px-2">
              {navItems.map((item) => {
                 const Icon = item.icon;
                 const isActive = pathname === item.href;
                 return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                        isActive ? 'text-rose-600' : 'text-stone-400'
                      )}
                    >
                       <div className={cn("p-1.5 rounded-2xl transition-all duration-300", isActive ? 'bg-rose-100 scale-110' : '')}>
                          <Icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                       </div>
                    </Link>
                 );
              })}
           </div>
        </div>
      </main>
    </div>
  );
}
