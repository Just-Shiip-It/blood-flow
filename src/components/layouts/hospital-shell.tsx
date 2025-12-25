"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Megaphone,
  LogOut,
  Building2,
  Settings,
  CalendarCheck
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/hospital/dashboard' },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck, href: '/hospital/appointments' },
  { id: 'inventory', label: 'Inventory', icon: Package, href: '/hospital/inventory' },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, href: '/hospital/campaigns' },
];

export function HospitalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  const getActiveTab = () => {
    const segment = pathname.split('/')[2];
    return segment || 'dashboard';
  };
  const activeTab = getActiveTab();

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      
      {/* Clinical Sidebar */}
      <aside className="flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shadow-xl z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white font-bold text-xl font-serif">
            <div className="bg-rose-600 p-1.5 rounded-lg">
               <Building2 className="text-white w-5 h-5" />
            </div>
            <span>LifeFlow</span>
            <span className="text-xs font-sans font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full ml-auto">Center</span>
          </div>
          <div className="mt-6 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
             <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Location</p>
             <p className="text-sm font-medium text-white">NYC Center-01</p>
             <p className="text-xs text-slate-500">New York, NY</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = activeTab === item.id;
             return (
              <Link 
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm",
                  isActive 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' 
                    : 'hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
             );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <Link 
             href="/hospital/settings"
             className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mb-2"
           >
             <Settings size={18} />
             Settings
           </Link>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
           >
             <LogOut size={18} />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm z-10">
            <h2 className="font-bold text-slate-700">{navItems.find(i => i.id === activeTab)?.label || 'Settings'}</h2>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                     {user.name?.charAt(0) || 'S'}
                  </div>
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-slate-900">{user.name}</p>
                     <p className="text-xs text-slate-500">Staff</p>
                  </div>
               </div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
           {children}
        </div>
      </main>
    </div>
  );
}
