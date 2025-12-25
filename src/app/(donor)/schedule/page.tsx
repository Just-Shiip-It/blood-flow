"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Coffee,
  Wifi,
  Car,
  Star,
  ShieldCheck,
  CalendarCheck,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getCenters, scheduleAppointment, type CenterOption } from '@/actions/donor.actions';

const MORNING_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '11:30 AM'];
const AFTERNOON_SLOTS = ['01:00 PM', '01:30 PM', '02:00 PM', '03:00 PM', '03:30 PM', '04:30 PM'];

// Helper to generate next 7 days
const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i < 8; i++) { // Start from tomorrow
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push({
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateNum: d.getDate(),
            fullDate: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            iso: d.toISOString().split('T')[0]
        });
    }
    return days;
};

export default function SchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [centers, setCenters] = useState<CenterOption[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getNextDays()[0].iso);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function fetchCenters() {
      const result = await getCenters();
      setCenters(result);
      setLoadingCenters(false);
    }
    fetchCenters();
  }, []);

  const centerDetails = centers.find(c => c.id === selectedCenterId);
  const days = getNextDays();
  const selectedDayObj = days.find(d => d.iso === selectedDate);

  const handleCenterSelect = (id: string) => {
      setSelectedCenterId(id);
      setStep(2);
  };

  const handleConfirm = async () => {
      if (!selectedCenterId || !selectedDate || !selectedSlot) return;
      setIsBooking(true);
      try {
        await scheduleAppointment({
          centerId: selectedCenterId,
          scheduledDate: new Date(selectedDate),
          timeSlot: selectedSlot,
        });
        router.push('/dashboard'); // Redirect to dashboard after booking
      } catch (error) {
        console.error("Booking failed:", error);
        setIsBooking(false);
      }
  };

  const AmenityIcon = ({ name }: { name: string }) => {
      if (name.includes('Parking')) return <Car size={12} />;
      if (name.includes('WiFi')) return <Wifi size={12} />;
      if (name.includes('Snack') || name.includes('Cafeteria')) return <Coffee size={12} />;
      return <CheckCircle2 size={12} />;
  };

  if (!user) return null;

  return (
    <div className="space-y-6 relative h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
       
       {/* Step 1: Select Center */}
       {step === 1 && (
         <div className="flex-1 flex flex-col h-full">
            <div className="shrink-0 mb-6">
                <h1 className="text-2xl font-bold font-serif text-stone-900">Where would you like to donate?</h1>
                <p className="text-stone-500 text-sm mt-1">Select a comfortable location near you.</p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-stone-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by zip code, city, or venue..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500 outline-none shadow-sm transition-all"
                />
            </div>

            {loadingCenters ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              </div>
            ) : (
            <div className="space-y-4 overflow-y-auto pb-4 pr-1">
               {centers.map((center: CenterOption) => (
                 <motion.div 
                    key={center.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCenterSelect(center.id)}
                    className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/30 transition-all cursor-pointer group relative overflow-hidden"
                 >
                    {/* Hover Accent */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex justify-between items-start mb-2 pl-2">
                       <div>
                           <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{center.type}</span>
                                <div className="flex items-center gap-0.5 text-amber-500">
                                    <Star size={12} className="fill-current" />
                                    <span className="text-xs font-bold text-stone-600">{center.rating}</span>
                                </div>
                           </div>
                           <h4 className="font-bold text-lg text-stone-900 font-serif">{center.name}</h4>
                       </div>
                       <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-lg border border-stone-200 flex items-center gap-1">
                           <Clock size={12} /> ~15 min wait
                       </span>
                    </div>

                    <div className="pl-2 grid grid-cols-2 gap-y-2 text-sm text-stone-500 mb-4">
                       <div className="flex items-center gap-1.5">
                          <Navigation size={14} className="text-rose-500" />
                          {center.city}
                       </div>
                       <div className="flex items-center gap-1.5 truncate">
                          <MapPin size={14} className="text-rose-500" />
                          {center.address}
                       </div>
                    </div>

                    <div className="pl-2 flex items-center gap-2 mb-4">
                        {center.amenities.map((amenity: string) => (
                            <span key={amenity} className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                <AmenityIcon name={amenity} /> {amenity}
                            </span>
                        ))}
                    </div>

                    <div className="pl-2 flex justify-between items-center border-t border-stone-100 pt-3 mt-2">
                        <div className="text-xs text-rose-600 font-medium">
                           Next available: <span className="font-bold">Today</span>
                        </div>
                        <div className="flex items-center text-xs font-bold text-stone-400 group-hover:text-rose-600 transition-colors">
                             Select <ChevronRight size={16} />
                        </div>
                    </div>
                 </motion.div>

               ))}
            </div>
            )}
         </div>
       )}


       {/* Step 2: Date & Time */}
       {step === 2 && centerDetails && (
         <div className="flex-1 flex flex-col h-full">
            <div className="shrink-0 mb-6">
                <button 
                    onClick={() => setStep(1)} 
                    className="text-xs font-bold text-stone-400 hover:text-stone-600 mb-4 flex items-center gap-1 transition-colors"
                >
                    <ChevronLeft size={14} /> Back to locations
                </button>
                <h1 className="text-2xl font-bold font-serif text-stone-900">When works for you?</h1>
                <p className="text-stone-500 text-sm mt-1 flex items-center gap-1">
                    Booking at <span className="font-bold text-stone-700">{centerDetails.name}</span>
                </p>
            </div>
            
            <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 flex-1 flex flex-col overflow-hidden">
                {/* Date Picker Strip */}
                <div className="p-4 border-b border-stone-100 bg-stone-50/50 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 min-w-max">
                        {days.map((day) => {
                            const isSelected = selectedDate === day.iso;
                            return (
                                <button
                                    key={day.iso}
                                    onClick={() => setSelectedDate(day.iso)}
                                    className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all duration-200 ${
                                        isSelected 
                                        ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200 scale-105' 
                                        : 'bg-white border-stone-200 text-stone-500 hover:border-rose-300 hover:text-rose-600'
                                    }`}
                                >
                                    <span className="text-xs font-medium mb-1">{day.dayName}</span>
                                    <span className="text-xl font-bold font-serif">{day.dateNum}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Slots */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock size={14} /> Morning time
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {MORNING_SLOTS.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border relative overflow-hidden ${
                                        selectedSlot === slot 
                                        ? 'bg-rose-100 text-rose-700 border-rose-200 ring-2 ring-rose-500 ring-offset-1' 
                                        : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300 hover:bg-rose-50'
                                    }`}
                                >
                                    {slot}
                                    {/* Random "Urgent" badge for demo */}
                                    {slot === '09:00 AM' && selectedSlot !== slot && (
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-bl-lg"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock size={14} /> Afternoon
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {AFTERNOON_SLOTS.map(slot => (
                                <button
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border ${
                                        selectedSlot === slot 
                                        ? 'bg-rose-100 text-rose-700 border-rose-200 ring-2 ring-rose-500 ring-offset-1' 
                                        : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300 hover:bg-rose-50'
                                    }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-stone-50 rounded-xl flex items-start gap-3 border border-stone-100">
                        <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                        <div>
                            <p className="text-sm font-bold text-stone-900">Safe & Sterile Environment</p>
                            <p className="text-xs text-stone-500 leading-relaxed mt-1">
                                Our centers adhere to strict hygiene protocols. All equipment is single-use and sterile.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="p-6 border-t border-stone-100 bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-stone-400 font-bold uppercase">Appointment</p>
                            <p className="text-sm font-bold text-stone-900">
                                {selectedDayObj ? selectedDayObj.fullDate : '--'} {selectedSlot ? `at ${selectedSlot}` : ''}
                            </p>
                        </div>
                    </div>
                    <Button 
                        disabled={!selectedSlot || isBooking}
                        onClick={handleConfirm}
                        className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-rose-500/20"
                    >
                        {isBooking ? 'Confirming...' : 'Confirm Appointment'}
                    </Button>
                </div>
            </div>
         </div>
       )}

       {/* Step 3: Success */}
       {step === 3 && centerDetails && (
           <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 relative">
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: "spring", stiffness: 200, damping: 10 }}
                   >
                       <CheckCircle2 size={48} className="text-green-600" />
                   </motion.div>
                   {/* Confetti particles could go here in a more complex setup */}
                   <div className="absolute inset-0 rounded-full border-4 border-green-50 animate-ping"></div>
               </div>
               
               <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">You're All Set!</h2>
               <p className="text-stone-500 max-w-xs mx-auto mb-8">
                   Your appointment has been confirmed. A calendar invite has been sent to your email.
               </p>

               <div className="bg-white p-6 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 w-full max-w-sm mb-8 text-left">
                   <div className="flex items-start gap-4 mb-4 border-b border-stone-100 pb-4">
                        <div className="w-12 h-12 bg-rose-50 rounded-xl flex flex-col items-center justify-center text-rose-700 shrink-0">
                            <span className="text-[10px] font-bold uppercase">{selectedDayObj?.dayName}</span>
                            <span className="text-lg font-bold font-serif">{selectedDayObj?.dateNum}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-stone-900 text-lg">{centerDetails.name}</h3>
                            <p className="text-sm text-stone-500">{centerDetails.address}</p>
                        </div>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                       <span className="text-stone-500">Time</span>
                       <span className="font-bold text-stone-900">{selectedSlot}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm mt-2">
                       <span className="text-stone-500">Procedure</span>
                       <span className="font-bold text-stone-900">Whole Blood</span>
                   </div>
               </div>

               <div className="flex flex-col w-full max-w-xs gap-3">
                   <Button variant="outline" className="w-full">
                       <CalendarCheck size={18} className="mr-2" /> Add to Calendar
                   </Button>
                   <button 
                     onClick={() => setStep(1)}
                     className="text-stone-400 hover:text-stone-600 text-sm font-bold py-2"
                   >
                       Book another appointment
                   </button>
               </div>
           </div>
       )}
    </div>
  );
}
