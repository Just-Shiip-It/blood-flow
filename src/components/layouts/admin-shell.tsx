"use client";

import React from 'react';
import { 
  LayoutGrid, 
  Building, 
  Users, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutGrid, href: '/admin' },
  { id: 'facilities', label: 'Facilities', icon: Building, href: '/admin/facilities' },
  { id: 'users', label: 'User Access', icon: Users, href: '/admin/users' },
  { id: 'settings', label: 'System Config', icon: Settings, href: '/admin/settings' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  const getActiveTab = () => {
    if (pathname === '/admin') return 'dashboard';
    const segment = pathname.split('/')[2];
    return segment || 'dashboard';
  };
  const activeTab = getActiveTab();

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      
      {/* Admin Sidebar - Dark Theme */}
      <aside className="flex flex-col w-64 bg-slate-950 text-slate-400 border-r border-slate-900 shadow-2xl z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white font-bold text-xl font-serif">
             <div className="bg-linear-to-br from-rose-700 to-purple-800 p-1.5 rounded-lg shadow-inner">
               <Shield className="text-white w-5 h-5" />
            </div>
            <span>LifeFlow</span>
            <span className="text-[10px] font-sans font-bold text-slate-950 bg-slate-200 px-2 py-0.5 rounded-full ml-auto uppercase tracking-wide">Admin</span>
          </div>
          <p className="mt-4 text-xs font-mono text-slate-600">v2.4.0-stable build</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <p className="px-4 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Management</p>
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
                    ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                    : 'hover:bg-slate-900 hover:text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
             );
          })}
        </nav>

        <div className="p-4 border-t border-slate-900 bg-slate-900/50">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center font-bold text-xs border border-purple-700">
                 {user.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                 <p className="font-bold text-sm text-white truncate">{user.name}</p>
                 <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
           >
             <LogOut size={16} />
             Sign Out System
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50/50">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm z-10">
            <h2 className="font-bold text-slate-800 text-lg">{navItems.find(i => i.id === activeTab)?.label}</h2>
            <div className="flex items-center gap-4">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-mono text-slate-400">System Online</span>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
