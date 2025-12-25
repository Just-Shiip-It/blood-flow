"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  Clipboard, 
  Save,
  X,
  Search,
  AlertCircle,
  MoreHorizontal,
  Activity,
  Scale,
  Thermometer,
  Heart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getHospitalAppointments, updateAppointmentStatus, createScreeningAndDonation, type AppointmentWithDonor } from '@/actions/hospital.actions';

interface DisplayAppointment {
  id: string;
  donorName: string;
  donorId: string;
  time: string;
  date: string;
  type: string;
  bloodType: string;
  phone: string;
  status: 'Scheduled' | 'Checked-In' | 'Screened' | 'Deferred';
}

interface ScreeningForm {
  weight: number;
  temperature: number;
  bpSystolic: number;
  bpDiastolic: number;
  pulse: number;
  hemoglobin: number;
  notes: string;
}

export default function HospitalAppointmentsPage() {
  const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<DisplayAppointment | null>(null);
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [screeningForm, setScreeningForm] = useState<ScreeningForm>({
    weight: 70,
    temperature: 36.6,
    bpSystolic: 120,
    bpDiastolic: 80,
    pulse: 72,
    hemoglobin: 14.5,
    notes: ''
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getHospitalAppointments();
      const mapped = data.map((apt: AppointmentWithDonor) => {
        const statusMap: Record<string, DisplayAppointment['status']> = {
          'scheduled': 'Scheduled',
          'checked_in': 'Checked-In',
          'donating': 'Screened',
          'completed': 'Screened',
          'cancelled': 'Deferred',
          'missed': 'Deferred',
        };
        return {
          id: apt.id,
          donorName: apt.donor.name,
          donorId: apt.donor.id.slice(0, 8),
          time: apt.timeSlot,
          date: new Date(apt.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          type: 'Whole Blood',
          bloodType: apt.donor.bloodType ?? 'Unknown',
          phone: apt.donor.phone ?? '',
          status: statusMap[apt.status] ?? 'Scheduled',
        };
      });
      setAppointments(mapped);
      setLoading(false);
    }
    fetchData();
  }, []);

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'Scheduled').length,
    processing: appointments.filter(a => ['Checked-In'].includes(a.status)).length,
    ready: appointments.filter(a => ['Screened'].includes(a.status)).length
  };

  const handleStatusChange = async (id: string, newStatus: DisplayAppointment['status']) => {
    const dbStatusMap: Record<DisplayAppointment['status'], "scheduled" | "checked_in" | "donating" | "completed" | "cancelled" | "missed"> = {
      'Scheduled': 'scheduled',
      'Checked-In': 'checked_in',
      'Screened': 'completed',
      'Deferred': 'cancelled',
    };
    await updateAppointmentStatus(id, dbStatusMap[newStatus]);
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const openScreening = (app: DisplayAppointment) => {
    setSelectedAppointment(app);
    setScreeningForm({
      weight: 70,
      temperature: 36.6,
      bpSystolic: 120,
      bpDiastolic: 80,
      pulse: 72,
      hemoglobin: 14.5,
      notes: ''
    });
    setIsScreeningModalOpen(true);
  };

  const handleScreeningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    
    // Optionally call backend to create screening record
    // await createScreeningAndDonation({ ... });
    
    await handleStatusChange(selectedAppointment.id, 'Screened');
    setIsScreeningModalOpen(false);
    setSelectedAppointment(null);
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.donorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.donorId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Screened': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit"><CheckCircle2 size={12}/> Cleared</span>;
      case 'Checked-In': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1 w-fit"><User size={12}/> Arrived</span>;
      case 'Deferred': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 w-fit"><XCircle size={12}/> Deferred</span>;
      case 'Scheduled': return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 w-fit"><Calendar size={12}/> Expected</span>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      
      {/* Workflow Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                 <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
             </div>
             <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                 <Calendar size={20} />
             </div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
                 <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
             </div>
             <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                 <Clock size={20} />
             </div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Screening</p>
                 <p className="text-2xl font-bold text-slate-900">{stats.processing}</p>
             </div>
             <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                 <Clipboard size={20} />
             </div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
             <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready</p>
                 <p className="text-2xl font-bold text-slate-900">{stats.ready}</p>
             </div>
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                 <CheckCircle2 size={20} />
             </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
               {['All', 'Scheduled', 'Checked-In', 'Screened', 'Deferred'].map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setFilterStatus(tab)}
                     className={`px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                         filterStatus === tab 
                         ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
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
                     placeholder="Search Name or ID..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-200 outline-none transition-all focus:bg-white"
                   />
               </div>
               <Button size="sm" className="shrink-0 bg-rose-600 hover:bg-rose-700 gap-2">
                   <Calendar size={18} /> Walk-In
               </Button>
            </div>
         </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Donor Profile</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Donation Type</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4 pl-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-mono text-sm font-semibold text-slate-700 bg-slate-100 w-fit px-2 py-1 rounded">
                            <Clock size={14} className="text-slate-400" />
                            {app.time}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm">
                            {app.donorName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{app.donorName}</p>
                            <p className="text-xs text-slate-500 font-mono">ID: {app.donorId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${app.type === 'Whole Blood' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                           <span className="text-sm font-medium text-slate-700">{app.type}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {app.status === 'Scheduled' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, 'Checked-In')}
                              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                            >
                              Check In
                            </button>
                          )}
                          {app.status === 'Checked-In' && (
                            <button 
                              onClick={() => openScreening(app)}
                              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-all shadow-sm shadow-rose-200 flex items-center gap-2"
                            >
                              <Clipboard size={14} /> Screen
                            </button>
                          )}
                          {app.status === 'Screened' && (
                             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                                <MoreHorizontal size={20} />
                             </button>
                          )}
                           {app.status === 'Deferred' && (
                             <span className="text-xs text-slate-400 italic">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                             <Search size={32} className="opacity-20" />
                             <p>No appointments found.</p>
                          </div>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screening Modal */}
      <AnimatePresence>
        {isScreeningModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                       <Clipboard className="text-rose-600" size={24} /> 
                       Clinical Screening
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Donor: <span className="font-bold text-slate-900">{selectedAppointment.donorName}</span> • 
                        ID: <span className="font-mono text-slate-600">{selectedAppointment.donorId}</span>
                    </p>
                 </div>
                 <button onClick={() => setIsScreeningModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                    <X size={24} />
                 </button>
              </div>

              {/* Scrollable Form Area */}
              <div className="flex-1 overflow-y-auto p-8">
                <form id="screening-form" onSubmit={handleScreeningSubmit} className="space-y-8">
                    
                    {/* Vital Signs Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Activity size={16} className="text-rose-500" /> Physiological Vitals
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Hemoglobin */}
                            <div className="relative group">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Hemoglobin</label>
                                <div className="relative">
                                    <input 
                                        type="number" step="0.1"
                                        className={`w-full pl-3 pr-10 py-2.5 bg-slate-50 border rounded-xl font-mono font-bold text-lg outline-none transition-all ${
                                            screeningForm.hemoglobin < 12.5 && screeningForm.hemoglobin > 0 
                                            ? 'border-amber-300 bg-amber-50 text-amber-700 focus:ring-2 focus:ring-amber-200' 
                                            : 'border-slate-200 text-slate-900 focus:ring-2 focus:ring-rose-200 focus:border-rose-500'
                                        }`}
                                        value={screeningForm.hemoglobin || ''}
                                        onChange={e => setScreeningForm({...screeningForm, hemoglobin: parseFloat(e.target.value)})}
                                        required
                                    />
                                    <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">g/dL</span>
                                </div>
                                <div className="mt-1.5 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400">Min: 12.5</span>
                                    {screeningForm.hemoglobin < 12.5 && screeningForm.hemoglobin > 0 && (
                                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                                            <AlertCircle size={10} /> Low
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Temp */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Temperature</label>
                                <div className="relative">
                                    <input 
                                        type="number" step="0.1"
                                        className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-lg outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500 text-slate-900"
                                        value={screeningForm.temperature || ''}
                                        onChange={e => setScreeningForm({...screeningForm, temperature: parseFloat(e.target.value)})}
                                        required
                                    />
                                    <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">°C</span>
                                </div>
                            </div>

                            {/* Pulse */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Pulse Rate</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-lg outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500 text-slate-900"
                                        value={screeningForm.pulse || ''}
                                        onChange={e => setScreeningForm({...screeningForm, pulse: parseInt(e.target.value)})}
                                        required
                                    />
                                    <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">bpm</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                             {/* BP */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Blood Pressure</label>
                                <div className="flex gap-2 items-center">
                                    <input 
                                        type="number" placeholder="Sys"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-lg outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500 text-slate-900"
                                        value={screeningForm.bpSystolic || ''}
                                        onChange={e => setScreeningForm({...screeningForm, bpSystolic: parseInt(e.target.value)})}
                                        required
                                    />
                                    <span className="text-slate-300 font-light text-xl">/</span>
                                    <input 
                                        type="number" placeholder="Dia"
                                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-lg outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500 text-slate-900"
                                        value={screeningForm.bpDiastolic || ''}
                                        onChange={e => setScreeningForm({...screeningForm, bpDiastolic: parseInt(e.target.value)})}
                                        required
                                    />
                                </div>
                            </div>

                             {/* Weight */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Weight</label>
                                <div className="relative">
                                    <input 
                                        type="number" step="0.1"
                                        className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-lg outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500 text-slate-900"
                                        value={screeningForm.weight || ''}
                                        onChange={e => setScreeningForm({...screeningForm, weight: parseFloat(e.target.value)})}
                                        required
                                    />
                                    <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">kg</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1.5">Min: 50kg</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Clinical Observations</label>
                        <textarea 
                           className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none h-24 resize-none text-sm transition-all"
                           placeholder="Add notes about vein check, skin condition, or donor anxiety..."
                           value={screeningForm.notes}
                           onChange={e => setScreeningForm({...screeningForm, notes: e.target.value})}
                        ></textarea>
                    </div>

                </form>
              </div>

              {/* Footer Actions */}
              <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex gap-4 shrink-0">
                  <Button type="button" variant="outline" onClick={() => setIsScreeningModalOpen(false)} className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-100">
                     Cancel
                  </Button>
                  <Button type="button" variant="outline" className="flex-1 border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200" onClick={() => { handleStatusChange(selectedAppointment.id, 'Deferred'); setIsScreeningModalOpen(false); }}>
                     <XCircle size={18} className="mr-2" /> Defer
                  </Button>
                  <Button type="submit" form="screening-form" className="flex-2 shadow-lg shadow-rose-200 bg-rose-600 hover:bg-rose-700">
                     <Save size={18} className="mr-2" /> Approve & Queue
                  </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
