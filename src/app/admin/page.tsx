"use client";

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  AlertOctagon,
  Activity,
  ArrowUpRight,
  Droplet,
  Clock,
  Map,
  FileText,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAdminDashboard, type AdminDashboardStats } from '@/actions/admin.actions';

// Simple SVG Chart Component
const MiniTrendChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 40;
  const width = 120;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        points={points} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx={(data.length - 1) * (width / (data.length - 1))} cy={height - ((data[data.length - 1] - min) / range) * height} r="3" fill={color} />
    </svg>
  );
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getAdminDashboard();
      setStats(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const donationTrend = [45, 52, 49, 62, 58, 71, 65, 75, 68, 82, 78, stats?.totalDonations ?? 88];
  const efficiencyTrend = [88, 85, 89, 90, 92, 91, 93, 94, 95, 95, 96, 96];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Executive Overview</h1>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Operational • Last updated 2 mins ago
          </p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" size="sm" className="text-slate-600 border border-slate-200 bg-white">
             <FileText size={16} className="mr-2" /> Export Report
           </Button>
           <Button size="sm" className="bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200">
             <Activity size={16} className="mr-2" /> System Health
           </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Total Donors */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                  <Users size={20} />
               </div>
               <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  <ArrowUpRight size={14} className="mr-1" /> Active
               </span>
            </div>
            <div className="mb-4">
                <p className="text-3xl font-bold text-slate-900">{stats?.totalDonors ?? 0}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Donors</p>
            </div>

            <MiniTrendChart data={donationTrend} color="#10b981" />
         </div>

         {/* Volume */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                  <Droplet size={20} className="fill-current" />
               </div>
               <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  <ArrowUpRight size={14} className="mr-1" /> +5%
               </span>
            </div>
            <div className="mb-4">
                <p className="text-3xl font-bold text-slate-900">8,200 L</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Volume (YTD)</p>
            </div>
            <MiniTrendChart data={donationTrend} color="#e11d48" />
         </div>

         {/* Efficiency */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                  <Clock size={20} />
               </div>
               <span className="flex items-center text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                  <Activity size={14} className="mr-1" /> Stable
               </span>
            </div>
            <div className="mb-4">
                <p className="text-3xl font-bold text-slate-900">45m</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Processing</p>
            </div>
            <MiniTrendChart data={efficiencyTrend} color="#3b82f6" />
         </div>

         {/* Critical Alerts */}
         <div className="bg-linear-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <AlertOctagon size={64} />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-white/10 rounded-xl text-rose-400 backdrop-blur-sm border border-white/10">
                      <AlertOctagon size={20} />
                   </div>
                </div>
                <div className="mb-2">
                    <p className="text-4xl font-bold text-white">3</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Alerts</p>
                </div>
                <p className="text-xs text-slate-400 mt-4 border-t border-slate-700 pt-3">
                   Requires immediate attention in <span className="text-white font-bold">Midwest Region</span>.
                </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Regional Supply Matrix */}
         <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <Map size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Regional Supply Network</h3>
                        <p className="text-xs text-slate-500">Live distribution levels by territory</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            
            <div className="p-6 grid gap-6">
                {[
                    { region: 'North America (East)', status: 'Optimal', load: 85, critical: [] as string[] },
                    { region: 'North America (West)', status: 'Stable', load: 62, critical: ['O-'] },
                    { region: 'Europe (Central)', status: 'Low Supply', load: 35, critical: ['O-', 'A-'] },
                    { region: 'Asia Pacific (Hub)', status: 'Optimal', load: 78, critical: [] as string[] },
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6">
                        <div className="w-48 shrink-0">
                            <p className="font-bold text-sm text-slate-900">{item.region}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Optimal' ? 'bg-emerald-500' : item.status === 'Stable' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                                {item.status}
                            </p>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1.5">
                                <span className="text-xs font-bold text-slate-400">Capacity</span>
                                <span className="text-xs font-bold text-slate-700">{item.load}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${item.load < 40 ? 'bg-amber-400' : 'bg-slate-900'}`} 
                                    style={{ width: `${item.load}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="w-48 flex justify-end gap-2">
                             {item.critical.length > 0 ? (
                                 item.critical.map(type => (
                                     <span key={type} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                                         {type} Critical
                                     </span>
                                 ))) : (
                                 <span className="px-2 py-1 rounded bg-slate-50 text-slate-400 text-xs font-bold border border-slate-100">
                                     All Types OK
                                 </span>
                             )}
                        </div>
                    </div>
                ))}
            </div>
         </div>

         {/* Live System Feed */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Activity size={18} className="text-rose-600" />
                    Live System Feed
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
                {[
                    { type: 'error', msg: 'Connection lost: Node-4 (Boston)', time: '2 min ago' },
                    { type: 'warning', msg: 'Low Inventory Alert: O- (Midwest)', time: '15 min ago' },
                    { type: 'success', msg: 'Batch #9921 cleared FDA check', time: '1 hr ago' },
                    { type: 'info', msg: 'New Center Registration: Seattle', time: '2 hrs ago' },
                    { type: 'info', msg: 'System Backup Completed', time: '4 hrs ago' },
                ].map((log, i) => (
                    <div key={i} className="px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 items-start last:border-0">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            log.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                            log.type === 'warning' ? 'bg-amber-500' : 
                            log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-400'
                        }`}></div>
                        <div>
                            <p className="text-sm font-medium text-slate-800 leading-snug">{log.msg}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">{log.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-xs font-bold text-slate-500 hover:text-slate-800">View Full Log History</button>
            </div>
         </div>
      </div>
    </div>
  );
}
