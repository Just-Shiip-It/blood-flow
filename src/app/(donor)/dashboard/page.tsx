"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Droplet, 
  Heart, 
  MapPin, 
  QrCode, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { getDonorDashboard, type DonorDashboardData } from '@/actions/donor.actions';

export default function DonorDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DonorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const result = await getDonorDashboard();
        setData(result);
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);
  
  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const hasUpcoming = data?.upcomingAppointment != null;
  const upcomingDate = data?.upcomingAppointment?.scheduledDate 
    ? new Date(data.upcomingAppointment.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  const upcomingTime = data?.upcomingAppointment?.timeSlot ?? '';
  const upcomingCenter = data?.upcomingAppointment?.center?.name ?? '';

  const renderHeroCard = () => {
    if (hasUpcoming && data?.upcomingAppointment) {
      return (
        <div className="bg-linear-to-br from-rose-500 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-rose-200/50 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-15 transition-opacity duration-700"></div>
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-300 opacity-20 rounded-full blur-2xl -ml-10 -mb-10 animate-pulse"></div>
           
           <div className="relative z-10">
             <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-8">
                <div>
                   <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-white/20 shadow-sm text-white">
                     <Calendar size={12} /> Upcoming Appointment
                   </span>
                   <h2 className="text-3xl font-serif font-bold leading-tight">You're all set,<br/>{data.user.name?.split(' ')[0]}!</h2>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                   <QrCode className="text-stone-900 w-12 h-12" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-md">
                      <Clock size={20} className="fill-current text-rose-100 stroke-rose-600" />
                   </div>
                   <div>
                      <p className="text-rose-100 text-xs uppercase tracking-wider font-bold">When</p>
                      <p className="font-semibold text-lg">{upcomingDate}</p>
                      <p className="text-sm opacity-90">{upcomingTime}</p>
                   </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-md">
                      <MapPin size={20} className="fill-current text-rose-100 stroke-rose-600" />
                   </div>
                   <div>
                      <p className="text-rose-100 text-xs uppercase tracking-wider font-bold">Where</p>
                      <p className="font-semibold text-lg truncate max-w-[150px]">{upcomingCenter}</p>
                      <button className="text-sm underline opacity-90 hover:opacity-100">Get Directions</button>
                   </div>
                </div>
             </div>

             <Link href="/schedule" className="w-full bg-white text-rose-600 font-bold py-4 rounded-xl shadow-lg hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                Reschedule <ChevronRight size={18} />
             </Link>
           </div>
        </div>
      );
    } 
    
    return (
        <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-xl shadow-stone-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                        <Sparkles size={12} /> Eligible to Donate
                    </span>
                </div>
                
                <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4 leading-tight">
                   Ready to be a hero today, {data?.user.name?.split(' ')[0]}?
                </h2>
                <p className="text-stone-500 mb-8 max-w-md text-lg">
                   There is a high demand for blood in your area right now. Your contribution can save up to 3 lives.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                   <Button asChild size="lg" className="shadow-rose-500/25 bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 px-8 rounded-xl">
                      <Link href="/schedule">Book an Appointment</Link>
                   </Button>
                   <Button asChild variant="outline" size="lg" className="border-stone-300 text-stone-700 font-bold h-12 px-8 rounded-xl">
                      <Link href="/impact">View My Impact</Link>
                   </Button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div>
         <h1 className="text-2xl font-bold font-serif text-stone-900">Welcome back, {data?.user.name?.split(' ')[0]}!</h1>
         <p className="text-stone-500 text-sm">Your generosity continues to make a difference.</p>
       </div>

       {renderHeroCard()}

       {/* Stats Grid */}
       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
               <Droplet size={24} className="fill-rose-100" />
            </div>
            <div>
               <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Donations</p>
               <p className="text-2xl font-bold text-stone-900">{data?.stats.totalDonations ?? 0}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
               <Heart size={24} className="fill-red-100" />
            </div>
            <div>
               <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Lives Saved</p>
               <p className="text-2xl font-bold text-stone-900">{data?.stats.livesSaved ?? 0}</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-2 md:col-span-1 bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
               <Clock size={24} />
            </div>
            <div>
               <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Last Donation</p>
               <p className="text-lg font-bold text-stone-900">
                 {data?.stats.lastDonation 
                   ? new Date(data.stats.lastDonation).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                   : 'N/A'}
               </p>
            </div>
          </motion.div>
       </div>

       {/* Quick Actions */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/wellness" className="group bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex items-center justify-between hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 transition-all">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                   <Sparkles size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-stone-900">Wellness Passport</h3>
                   <p className="text-sm text-stone-500">View your health trends</p>
                </div>
             </div>
             <ArrowRight size={20} className="text-stone-300 group-hover:text-rose-500 transition-colors" />
          </Link>

          <Link href="/history" className="group bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex items-center justify-between hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 transition-all">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                   <Calendar size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-stone-900">Donation History</h3>
                   <p className="text-sm text-stone-500">See all your past donations</p>
                </div>
             </div>
             <ArrowRight size={20} className="text-stone-300 group-hover:text-rose-500 transition-colors" />
          </Link>
       </div>
    </div>
  );
}
