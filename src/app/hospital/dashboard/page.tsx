"use client";

import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Droplet, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Package,
  Snowflake,
  Truck,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHospitalDashboard, getHospitalInventory, type HospitalDashboardStats, type InventoryItem } from '@/actions/hospital.actions';

export default function HospitalDashboardPage() {
  const [stats, setStats] = useState<HospitalDashboardStats | null>(null);
  const [centerName, setCenterName] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const dashboardData = await getHospitalDashboard();
      const inventoryData = await getHospitalInventory();
      
      if (dashboardData) {
        setStats(dashboardData.stats);
        setCenterName(dashboardData.center.name);
      }
      setInventory(inventoryData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Aggregate inventory by blood type for visualization
  const bloodLevels = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(type => {
    const typeInventory = inventory.filter(i => i.bloodType === type);
    const totalUnits = typeInventory.reduce((sum, i) => sum + i.unitsAvailable, 0);
    const maxExpected = 50; // Assume 50 units is "full"
    const level = Math.min(100, Math.round((totalUnits / maxExpected) * 100));
    return {
      type,
      level,
      units: totalUnits,
      status: level < 20 ? 'critical' : level < 40 ? 'low' : 'good',
      trend: 'stable' as const
    };
  });

  const criticalCount = bloodLevels.filter(b => b.status === 'critical').length;
  const totalUnits = inventory.reduce((sum, i) => sum + i.unitsAvailable, 0);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      case 'low': return 'bg-amber-400';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-2xl font-bold text-slate-900 font-serif">Operations Dashboard</h1>
             <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
             </span>
          </div>
          <p className="text-slate-500 text-sm">Real-time inventory and logistics for <span className="font-semibold text-slate-700">{centerName || 'Your Center'}</span></p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" size="sm" className="bg-white">
             <Truck size={16} className="mr-2" /> Schedule Pickup
           </Button>
           <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white border-none shadow-red-200 shadow-lg">
             <AlertTriangle size={16} className="mr-2" />
             Trigger Shortage Alert
           </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Critical Alert Card */}
         <div className="bg-linear-to-br from-red-50 to-white p-5 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-3 relative z-10">
               <div className="p-2.5 bg-white text-red-600 rounded-xl shadow-sm border border-red-50">
                  <AlertTriangle size={20} />
               </div>
               <span className="text-red-600 text-xs font-bold bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                   {criticalCount > 0 ? 'Action Needed' : 'OK'}
               </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{criticalCount} Types</p>
            <p className="text-xs font-bold text-red-700/70 uppercase tracking-wider">Critical Low Supply</p>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
               <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Package size={20} />
               </div>
               <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> Active
               </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{totalUnits}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Units</p>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
               <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Users size={20} />
               </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{stats?.todaysAppointments ?? 0}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointments Today</p>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
               <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Activity size={20} />
               </div>
               <span className="text-slate-400 text-xs font-bold bg-slate-50 px-2 py-0.5 rounded-full">
                  {stats?.pendingScreenings ?? 0} Pending
               </span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{stats?.completedToday ?? 0}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Today</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Inventory Visualizer */}
         <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Droplet size={20} className="text-rose-600 fill-rose-600" />
                    Live Inventory Levels
                    </h3>
                    <p className="text-sm text-slate-500">Real-time volume tracking by blood type.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Good
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span> Low
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 h-48 items-end">
               {bloodLevels.map((item) => (
                  <div key={item.type} className="flex flex-col items-center group cursor-pointer h-full justify-end relative">
                     {/* Hover Tooltip */}
                     <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                         {item.units} Units Available
                         <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                     </div>

                     <div className="w-full max-w-[40px] h-full bg-slate-100 rounded-t-full rounded-b-2xl relative overflow-hidden border border-slate-200">
                         {/* Liquid Level */}
                         <div 
                           className={`absolute bottom-0 left-0 right-0 w-full transition-all duration-1000 ease-in-out ${getStatusColor(item.status)}`}
                           style={{ height: `${item.level}%` }}
                         >
                            {/* Surface Shine */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30"></div>
                         </div>
                         
                         {/* Measurement Lines */}
                         <div className="absolute inset-0 flex flex-col justify-evenly opacity-30 pointer-events-none p-1">
                             <div className="w-full h-px bg-slate-400"></div>
                             <div className="w-2/3 h-px bg-slate-400"></div>
                             <div className="w-full h-px bg-slate-400"></div>
                             <div className="w-2/3 h-px bg-slate-400"></div>
                         </div>
                     </div>
                     <span className={`mt-3 font-bold text-sm font-mono ${item.status === 'critical' ? 'text-red-600' : 'text-slate-600'}`}>
                        {item.type}
                     </span>
                  </div>
               ))}
            </div>
         </div>

         {/* Facility Health & Actions */}
         <div className="flex flex-col gap-6">
             {/* Urgent Actions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex-1">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span>Urgent Tasks</span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{stats?.criticalInventory ?? 0} Critical</span>
                </h3>
                <div className="space-y-3">
                    {stats?.criticalInventory && stats.criticalInventory > 0 ? (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-2xl group hover:border-red-200 transition-colors cursor-pointer">
                          <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                                  <AlertTriangle size={12} /> Low Inventory Alert
                              </span>
                          </div>
                          <p className="text-sm font-bold text-slate-800 mb-2">{stats.criticalInventory} blood types at critical levels</p>
                          <div className="flex gap-2">
                               <button className="flex-1 bg-white border border-red-200 text-red-600 text-xs font-bold py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
                                  Request Restock
                               </button>
                               <button className="px-3 bg-white border border-red-200 text-red-400 text-xs font-bold py-1.5 rounded-lg hover:text-slate-600">
                                  Details
                               </button>
                          </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                        <p className="text-sm text-emerald-700 font-medium">All systems operational</p>
                      </div>
                    )}
                </div>
            </div>

            {/* Environment Stats */}
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Snowflake size={64} />
                 </div>
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    Facility Health
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                        <div className="flex items-center gap-2 text-blue-200 text-xs mb-1">
                            <Snowflake size={12} /> Fridge A
                        </div>
                        <p className="text-xl font-mono font-bold">2.4°C</p>
                        <p className="text-[10px] text-emerald-400">Optimal</p>
                     </div>
                     <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                        <div className="flex items-center gap-2 text-blue-200 text-xs mb-1">
                            <Snowflake size={12} /> Fridge B
                        </div>
                        <p className="text-xl font-mono font-bold">3.1°C</p>
                        <p className="text-[10px] text-emerald-400">Optimal</p>
                     </div>
                 </div>
            </div>
         </div>
      </div>
    </div>
  );
}
