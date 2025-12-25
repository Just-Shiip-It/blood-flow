"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  PackageCheck, 
  TestTube2, 
  FlaskConical, 
  Truck, 
  UserCheck,
  Share2,
  FileText,
  Building2,
  MapPin,
  Navigation,
  Clock,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// Enhanced stages with "System Metadata" to reflect the connected nature of the platform
const STAGES = [
  { 
    id: 1, 
    label: 'Collected', 
    icon: PackageCheck, 
    desc: 'Donation completed at center.',
    location: 'City Central Bank',
    metaLabel: 'Unit ID',
    metaValue: 'UNIT-88392-AX',
    daysOffset: 0 
  },
  { 
    id: 2, 
    label: 'Testing', 
    icon: TestTube2, 
    desc: 'Screened for infectious diseases and blood typing.',
    location: 'Regional Lab NYC-2',
    metaLabel: 'Lab Ref',
    metaValue: 'LAB-NYC-04',
    daysOffset: 1 
  },
  { 
    id: 3, 
    label: 'Processing', 
    icon: FlaskConical, 
    desc: 'Separated into Red Blood Cells, Plasma, and Platelets.',
    location: 'Processing Hub',
    metaLabel: 'Batch',
    metaValue: 'B-29921',
    daysOffset: 2 
  },
  { 
    id: 4, 
    label: 'Dispatched', 
    icon: Truck, 
    desc: 'Transported via temperature-controlled logistics.',
    location: 'Transit',
    metaLabel: 'Logistics',
    metaValue: 'Route 44',
    daysOffset: 5 
  },
  { 
    id: 5, 
    label: 'Delivered', 
    icon: Building2, 
    desc: 'Received by hospital inventory.',
    location: "St. Mary's Hospital",
    metaLabel: 'Inventory',
    metaValue: 'Fridge A-04',
    daysOffset: 7 
  },
  { 
    id: 6, 
    label: 'Used', 
    icon: UserCheck, 
    desc: 'Transfused to a patient in need.',
    location: 'Patient Ward',
    metaLabel: 'Outcome',
    metaValue: 'Life Saved',
    daysOffset: 9 
  },
];

const getStageDate = (baseDate: string, offset: number) => {
  const date = new Date(baseDate);
  if (isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function ImpactPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  // Mock data for the journey - In a real app, this would be fetched from the DB
  const latestDonation = {
    id: '88392-AX',
    date: 'Dec 01, 2025',
    journeyStage: 6, // Fully used/completed
  };

  const getDonationVolume = () => {
    // Mock value: 1 donation = 450ml
    const totalDonations = 5; // Replace with user.totalDonations if available
    return (totalDonations * 450 / 1000).toFixed(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
       
       {/* Header Section */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold font-serif text-stone-900">Donation Journey</h1>
            <p className="text-stone-500 text-sm">Tracking Unit <span className="font-mono font-bold text-stone-700">#{latestDonation.id}</span></p>
         </div>
         <div className="flex gap-3">
            <Button variant="outline" size="sm" className="bg-white text-stone-600 border border-stone-200 hover:bg-stone-50">
                <FileText size={16} className="mr-2" /> Medical Report
            </Button>
            <Button size="sm" className="bg-rose-600 text-white hover:bg-rose-700 shadow-sm">
                <Share2 size={16} className="mr-2" /> Share Impact
            </Button>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Left Column: Visual Map & Current Status */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Main Tracker Card */}
            <div className="bg-white rounded-3xl p-1 border border-stone-100 shadow-xl shadow-stone-200/40 overflow-hidden">
               <div className="relative bg-stone-900 rounded-[22px] p-6 text-white overflow-hidden">
                  {/* Background Map Effect */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                         <path d="M0,100 Q100,50 200,100 T400,100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                         <circle cx="50" cy="80" r="3" fill="currentColor" />
                         <circle cx="200" cy="100" r="3" fill="currentColor" />
                         <circle cx="350" cy="120" r="3" fill="currentColor" />
                      </svg>
                  </div>

                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-900/50 text-2xl font-bold font-serif border border-rose-400">
                            {user.bloodType || 'O+'}
                         </div>
                         <div>
                            <p className="text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">Current Status</p>
                            <h2 className="text-2xl font-bold">
                               {latestDonation.journeyStage === 6 ? 'Mission Complete' : STAGES[(latestDonation.journeyStage || 1) - 1].label}
                            </h2>
                            <p className="text-stone-400 text-sm flex items-center gap-1.5 mt-1">
                               <MapPin size={14} className="text-rose-500" />
                               {STAGES[(latestDonation.journeyStage || 1) - 1].location}
                            </p>
                         </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                         <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-right">
                            <p className="text-[10px] text-stone-400 uppercase font-bold">Estimated Completion</p>
                            <p className="font-mono font-bold text-emerald-400">
                               {getStageDate(latestDonation.date, 9)}
                            </p>
                         </div>
                      </div>
                  </div>

                  {/* Simple Progress Bar */}
                  <div className="mt-8 relative pt-6 pb-2">
                     <div className="absolute top-0 left-0 w-full h-1 bg-stone-800 rounded-full"></div>
                     <motion.div 
                        className="absolute top-0 left-0 h-1 bg-linear-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((latestDonation.journeyStage || 1) / 6) * 100}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                     ></motion.div>
                     
                     <div className="flex justify-between relative -mt-3.5">
                        {[1, 2, 3, 4, 5, 6].map((s) => {
                           const isCompleted = (latestDonation.journeyStage || 1) >= s;
                           const isCurrent = (latestDonation.journeyStage || 1) === s;
                           return (
                              <div key={s} className="flex flex-col items-center gap-2">
                                 <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center z-10 transition-colors duration-500 ${
                                    isCompleted 
                                      ? 'bg-rose-500 border-stone-900 shadow-lg shadow-rose-500/50' 
                                      : 'bg-stone-800 border-stone-900'
                                 }`}>
                                    {isCompleted && <div className="w-2 h-2 bg-white rounded-full" />}
                                 </div>
                                 {isCurrent && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: -5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="absolute top-8 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded"
                                    >
                                       Now
                                    </motion.div>
                                 )}
                              </div>
                           )
                        })}
                     </div>
                  </div>
               </div>
            </div>

            {/* Detailed Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
               <h3 className="font-bold text-stone-900 mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-stone-400" />
                  Journey Log
               </h3>
               <div className="relative pl-4 sm:pl-6 space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-4 before:w-0.5 before:bg-stone-100">
                  {STAGES.map((stage) => {
                     const currentStage = latestDonation.journeyStage || 1;
                     const isActive = currentStage >= stage.id;
                     const isCurrent = currentStage === stage.id;
                     const date = isActive ? getStageDate(latestDonation.date, stage.daysOffset) : 'Pending';
                     
                     return (
                        <div key={stage.id} className={`relative flex gap-6 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                           <div className={`
                              relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all duration-500 border
                              ${isActive 
                                 ? 'bg-white border-rose-100 text-rose-600 shadow-lg shadow-rose-100/50' 
                                 : 'bg-stone-50 border-stone-100 text-stone-300'}
                           `}>
                              <stage.icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                              {isCurrent && (
                                 <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                 </span>
                              )}
                           </div>
                           
                           <div className="flex-1 pt-1">
                              <div className="flex justify-between items-start">
                                 <h4 className="font-bold text-stone-900 text-sm">{stage.label}</h4>
                                 <span className="text-xs font-mono text-stone-400">{date}</span>
                              </div>
                              <p className="text-xs text-stone-500 mt-1 mb-2">{stage.desc}</p>
                              
                              {isActive && (
                                 <div className="inline-flex items-center gap-2 px-2 py-1 bg-stone-50 rounded border border-stone-100">
                                    <span className="text-[10px] font-bold text-stone-400 uppercase">{stage.metaLabel}:</span>
                                    <span className="text-[10px] font-mono text-stone-700">{stage.metaValue}</span>
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>

         {/* Right Column: Stats & Impact */}
         <div className="space-y-6">
            
            {/* Impact Card */}
            <div className="bg-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-rose-200 relative overflow-hidden group">
               {/* Decorative background */}
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Heart size={120} className="fill-current" />
               </div>
               
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 text-white border border-white/20">
                     <UserCheck size={24} />
                  </div>
                  <p className="text-rose-100 text-xs font-bold uppercase tracking-wider mb-1">Total Impact</p>
                  <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-serif font-bold">3</span>
                      <span className="text-xl text-rose-200">Lives</span>
                  </div>
                  <p className="text-sm text-rose-100/90 leading-relaxed border-t border-rose-500/50 pt-4 mt-2">
                     "Because of you, someone's father, mother, or child is coming home today."
                  </p>
               </div>
            </div>

            {/* Volume Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm relative overflow-hidden">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                     <FlaskConical size={24} />
                  </div>
                  <div>
                     <p className="text-stone-400 text-xs font-bold uppercase">Volume Donated</p>
                     <p className="text-2xl font-bold text-stone-900 font-serif">
                        {getDonationVolume()} L
                     </p>
                  </div>
               </div>
               <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-500 leading-relaxed">
                  That's enough to fill about <span className="font-bold text-stone-900">{Math.floor(parseFloat(getDonationVolume()) * 2)}</span> standard water bottles.
               </div>
            </div>

            {/* Did you know? */}
            <div className="bg-stone-900 rounded-3xl p-6 text-stone-300 relative overflow-hidden">
               <div className="flex items-start gap-3">
                  <div className="p-2 bg-stone-800 rounded-lg shrink-0">
                     <Navigation size={16} className="text-emerald-400" />
                  </div>
                  <div>
                     <p className="text-white font-bold text-sm mb-1">Journey Fact</p>
                     <p className="text-xs leading-relaxed opacity-80">
                        Your blood can travel up to 500 miles to reach a patient in critical need within our regional network.
                     </p>
                  </div>
               </div>
            </div>

         </div>
       </div>
    </div>
  );
}
