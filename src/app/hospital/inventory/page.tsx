"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical,
  Thermometer,
  Clock,
  AlertTriangle,
  Package,
  CheckCircle2,
  XCircle,
  FlaskConical,
  ScanBarcode,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHospitalInventory, type InventoryItem } from '@/actions/hospital.actions';

interface DisplayInventory {
  id: string;
  bloodType: string;
  component: string;
  unitsAvailable: number;
  lastUpdated: Date;
  status: 'Available' | 'Low' | 'Critical';
}

export default function HospitalInventoryPage() {
  const [inventory, setInventory] = useState<DisplayInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      const data = await getHospitalInventory();
      const mapped = data.map((item: InventoryItem) => ({
        id: item.id,
        bloodType: item.bloodType,
        component: item.component,
        unitsAvailable: item.unitsAvailable,
        lastUpdated: new Date(item.lastUpdated),
        status: (item.unitsAvailable <= 10 ? 'Critical' : item.unitsAvailable <= 20 ? 'Low' : 'Available') as 'Available' | 'Low' | 'Critical',

      }));
      setInventory(mapped);
      setLoading(false);
    }
    fetchData();
  }, []);

  const getStatusStyle = (status: string) => {
     switch(status) {
        case 'Available': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 };
        case 'Low': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock };
        case 'Critical': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: AlertTriangle };
        default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: Package };
     }
  };

  const filteredInventory = inventory.filter(item => {
    if (filter !== 'All' && item.status !== filter) return false;
    if (searchQuery && !item.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) && !item.component.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: inventory.reduce((sum, i) => sum + i.unitsAvailable, 0),
    available: inventory.filter(i => i.status === 'Available').reduce((sum, i) => sum + i.unitsAvailable, 0),
    low: inventory.filter(i => i.status === 'Low').length,
    critical: inventory.filter(i => i.status === 'Critical').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Package size={24} />
              </div>
              <div>
                  <p className="text-sm text-slate-500 font-medium">Total Units</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 size={24} />
              </div>
              <div>
                  <p className="text-sm text-slate-500 font-medium">Available</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.available}</p>
              </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock size={24} />
              </div>
              <div>
                  <p className="text-sm text-slate-500 font-medium">Low Stock</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.low}</p>
              </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <AlertTriangle size={24} />
              </div>
              <div>
                  <p className="text-sm text-slate-500 font-medium">Critical</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.critical}</p>
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
         {/* Toolbar */}
         <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
               {['All', 'Available', 'Low', 'Critical'].map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setFilter(tab)}
                     className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                         filter === tab 
                         ? 'bg-slate-900 text-white' 
                         : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                     }`}
                   >
                       {tab}
                   </button>
               ))}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
               <div className="relative flex-1 sm:w-64">
                   <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search blood type or component..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 outline-none transition-all focus:bg-white"
                   />
               </div>
               <Button size="sm" className="shrink-0 bg-rose-600 hover:bg-rose-700 gap-2">
                   <ScanBarcode size={18} /> Scan Unit
               </Button>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50/50 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                     <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Type</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Component</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Units</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</th>
                     <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => {
                      const statusStyle = getStatusStyle(item.status);
                      const StatusIcon = statusStyle.icon;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="p-4 pl-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border ${
                                        item.bloodType.includes('-') ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                                    }`}>
                                        {item.bloodType}
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <p className="font-medium text-slate-900 capitalize">{item.component.replace('_', ' ')}</p>
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                    <StatusIcon size={14} />
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-4">
                                <p className="text-lg font-bold text-slate-900">{item.unitsAvailable}</p>
                            </td>
                            <td className="p-4">
                                <p className="text-sm text-slate-600">
                                  {item.lastUpdated.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            </td>
                            <td className="p-4 text-right pr-6">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </td>
                        </tr>
                      );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
