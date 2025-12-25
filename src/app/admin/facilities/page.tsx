"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  MoreHorizontal,
  Plus,
  Search,
  Truck,
  FlaskConical,
  CheckCircle2,
  Gauge,
  Signal,
  Wrench,
  X,
  Edit2,
  Power,
  Settings,
  Save,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Facility {
  id: string;
  name: string;
  type: 'Hub' | 'Mobile' | 'Lab' | 'Center';
  location: string;
  region: string;
  capacity: number;
  currentLoad: number;
  staffActive: number;
  efficiency: number;
  status: 'Operational' | 'High Load' | 'Maintenance' | 'Offline';
  lastAudit: string;
}

const FACILITIES: Facility[] = [
  { id: 'FAC-001', name: 'NYC Main Hub', type: 'Hub', location: 'New York, NY', region: 'East', capacity: 5000, currentLoad: 4200, staffActive: 45, efficiency: 98, status: 'High Load', lastAudit: 'Oct 15' },
  { id: 'FAC-002', name: 'Boston General', type: 'Center', location: 'Boston, MA', region: 'East', capacity: 1200, currentLoad: 650, staffActive: 12, efficiency: 94, status: 'Operational', lastAudit: 'Oct 20' },
  { id: 'FAC-003', name: 'Philly Mobile Unit 4', type: 'Mobile', location: 'Philadelphia, PA', region: 'East', capacity: 200, currentLoad: 0, staffActive: 4, efficiency: 0, status: 'Maintenance', lastAudit: 'Oct 22' },
  { id: 'FAC-004', name: 'DC Research Lab', type: 'Lab', location: 'Washington, DC', region: 'East', capacity: 3000, currentLoad: 1200, staffActive: 28, efficiency: 99, status: 'Operational', lastAudit: 'Oct 10' },
  { id: 'FAC-005', name: 'Chicago North', type: 'Center', location: 'Chicago, IL', region: 'Midwest', capacity: 1500, currentLoad: 0, staffActive: 0, efficiency: 0, status: 'Offline', lastAudit: 'Sep 30' },
  { id: 'FAC-006', name: 'Seattle West', type: 'Center', location: 'Seattle, WA', region: 'West', capacity: 1100, currentLoad: 890, staffActive: 15, efficiency: 92, status: 'Operational', lastAudit: 'Oct 18' },
];

export default function AdminFacilitiesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const getStatusBadge = (status: Facility['status']) => {
    switch (status) {
      case 'Operational': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Operational</span>;
      case 'High Load': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>High Load</span>;
      case 'Maintenance': return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100"><Wrench size={10} /> Maintenance</span>;
      default: return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200"><Signal size={10} /> Offline</span>;
    }
  };

  const getTypeIcon = (type: Facility['type']) => {
    switch(type) {
      case 'Hub': return <Building2 size={16} className="text-purple-600" />;
      case 'Mobile': return <Truck size={16} className="text-blue-600" />;
      case 'Lab': return <FlaskConical size={16} className="text-rose-600" />;
      default: return <Building2 size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Facilities</p>
                 <p className="text-2xl font-bold text-slate-900">48</p>
             </div>
             <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                 <Building2 size={24} />
             </div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational</p>
                 <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-slate-900">42</p>
                    <span className="text-xs font-bold text-emerald-600 flex items-center"><ArrowUpRight size={12} /> 96%</span>
                 </div>
             </div>
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                 <CheckCircle2 size={24} />
             </div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Efficiency Avg</p>
                 <p className="text-2xl font-bold text-slate-900">94.2%</p>
             </div>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                 <Gauge size={24} />
             </div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance</p>
                 <p className="text-2xl font-bold text-slate-900">3</p>
             </div>
             <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                 <Wrench size={24} />
             </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
         {/* Toolbar */}
         <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900 font-serif">Facility Network</h2>
            
            <div className="flex gap-3 w-full sm:w-auto">
               <div className="relative flex-1 sm:w-64">
                   <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                   <input 
                     type="text" 
                     placeholder="Search facilities..." 
                     className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-200 outline-none"
                   />
               </div>
               <Button size="sm" className="bg-slate-900 hover:bg-slate-800" onClick={() => setIsAddModalOpen(true)}>
                   <Plus size={16} className="mr-2" /> Add Facility
               </Button>
            </div>
         </div>

         {/* List View */}
         <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                     <th className="p-4 pl-6">Facility Name</th>
                     <th className="p-4">Location</th>
                     <th className="p-4">Capacity Load</th>
                     <th className="p-4">Staffing</th>
                     <th className="p-4">Efficiency</th>
                     <th className="p-4">Status</th>
                     <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {FACILITIES.map((facility) => (
                     <tr key={facility.id} className="hover:bg-slate-50/80 transition-colors group relative">
                        <td className="p-4 pl-6">
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-slate-100 ${
                                 facility.type === 'Hub' ? 'bg-purple-50 text-purple-600' :
                                 facility.type === 'Mobile' ? 'bg-blue-50 text-blue-600' :
                                 facility.type === 'Lab' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
                              }`}>
                                 {getTypeIcon(facility.type)}
                              </div>
                              <div>
                                 <p className="font-bold text-slate-900 text-sm">{facility.name}</p>
                                 <p className="text-xs text-slate-500 font-mono">{facility.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-700">{facility.location}</span>
                              <span className="text-xs text-slate-400">{facility.region} Region</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="w-32">
                              <div className="flex justify-between text-xs mb-1">
                                 <span className="font-bold text-slate-700">{Math.round((facility.currentLoad / facility.capacity) * 100)}%</span>
                                 <span className="text-slate-400">{facility.currentLoad}/{facility.capacity}</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full ${
                                        (facility.currentLoad / facility.capacity) > 0.8 ? 'bg-amber-500' : 'bg-slate-900'
                                    }`}
                                    style={{ width: `${(facility.currentLoad / facility.capacity) * 100}%` }}
                                 ></div>
                              </div>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className="flex -space-x-2">
                              {[...Array(Math.min(3, facility.staffActive > 0 ? 3 : 0))].map((_, i) => (
                                 <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                                    {String.fromCharCode(65 + i)}
                                 </div>
                              ))}
                              {facility.staffActive > 3 && (
                                 <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                                    +{facility.staffActive - 3}
                                 </div>
                              )}
                              {facility.staffActive === 0 && <span className="text-xs text-slate-400 italic">No staff</span>}
                           </div>
                        </td>
                        <td className="p-4">
                           {facility.efficiency > 0 ? (
                               <span className={`text-sm font-bold ${facility.efficiency >= 95 ? 'text-emerald-600' : facility.efficiency >= 90 ? 'text-blue-600' : 'text-amber-600'}`}>
                                  {facility.efficiency}%
                               </span>
                           ) : (
                               <span className="text-xs text-slate-400">N/A</span>
                           )}
                        </td>
                        <td className="p-4">
                           {getStatusBadge(facility.status)}
                        </td>
                        <td className="p-4 pr-6 text-right">
                           <div className="relative">
                              <button 
                                onClick={(e) => {
                                   e.stopPropagation();
                                   setActiveActionId(activeActionId === facility.id ? null : facility.id);
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${activeActionId === facility.id ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                              >
                                 <MoreHorizontal size={18} />
                              </button>
                              
                              {activeActionId === facility.id && (
                                 <div className="absolute right-8 top-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 flex flex-col p-1 text-left animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium">
                                       <Edit2 size={14} /> Configure
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium">
                                       <Settings size={14} /> Manage Staff
                                    </button>
                                    <div className="h-px bg-slate-100 my-1"></div>
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                                       <Power size={14} /> Set Offline
                                    </button>
                                 </div>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
             <p className="text-xs text-slate-500">Showing 6 of 48 facilities</p>
             <div className="flex gap-2">
                 <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                 <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">Next</button>
             </div>
         </div>
      </div>

      {/* Add Facility Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
           <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
              >
                 <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <h3 className="font-bold text-lg text-slate-900 font-serif">Add New Facility</h3>
                     <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                 </div>
                 
                 <div className="p-6 space-y-4 overflow-y-auto">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name</label>
                       <Input placeholder="e.g. Northside General" />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Facility Type</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none bg-white">
                              <option>Collection Center</option>
                              <option>Mobile Unit</option>
                              <option>Processing Lab</option>
                              <option>Distribution Hub</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none bg-white">
                              <option>East Coast</option>
                              <option>West Coast</option>
                              <option>Midwest</option>
                              <option>International</option>
                           </select>
                        </div>
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                       <Input placeholder="123 Medical Blvd, City, State" />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Storage Capacity (Units)</label>
                           <Input type="number" placeholder="5000" />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Initial Staff Count</label>
                           <Input type="number" placeholder="10" />
                         </div>
                     </div>
                 </div>

                 <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                     <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                     <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => setIsAddModalOpen(false)}>
                        <Save size={16} className="mr-2" /> Register Facility
                     </Button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>

    </div>
  );
}
