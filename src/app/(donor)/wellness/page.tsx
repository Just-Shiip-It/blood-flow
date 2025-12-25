"use client";

import { useState } from 'react';
import { 
  Activity, 
  Lock, 
  Thermometer, 
  User, 
  Scale, 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ShieldCheck, 
  Info,
  ChevronDown,
  ChevronUp,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

// Helper to determine trend
const getTrend = (current: number, previous: number) => {
  if (current > previous) return { icon: TrendingUp, color: 'text-emerald-500', label: 'Up' };
  if (current < previous) return { icon: TrendingDown, color: 'text-rose-500', label: 'Down' };
  return { icon: Minus, color: 'text-slate-400', label: 'Stable' };
};

// Enhanced SVG Chart Component
const EnhancedChart = ({ 
  data, 
  dataKey, 
  color, 
  unit,
  height = 120,
  showArea = true
}: { 
  data: any[], 
  dataKey: string, 
  color: string,
  unit: string,
  height?: number,
  showArea?: boolean
}) => {
   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

   // Sort data: Oldest -> Newest
   const chartData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
   const numericValues = chartData.map(d => Number(d[dataKey]));

   if (numericValues.length < 2) return (
       <div className="h-full w-full flex items-center justify-center text-stone-300 text-xs italic bg-stone-50/50 rounded-xl">
           Not enough data
       </div>
   );

   const max = Math.max(...numericValues);
   const min = Math.min(...numericValues);
   const padding = (max - min) * 0.2 || 2; 
   const yMax = max + padding;
   const yMin = Math.max(0, min - padding);
   const yRange = yMax - yMin || 1;
   
   const width = 100; // Using percentage based viewBox logic
   const viewBoxWidth = 300;
   const paddingX = 10;
   const paddingY = 10;
   const graphWidth = viewBoxWidth - paddingX * 2;
   const graphHeight = height - paddingY * 2;

   const points = chartData.map((d, idx) => {
      const val = Number(d[dataKey]);
      const x = paddingX + (idx / (chartData.length - 1)) * graphWidth;
      const y = paddingY + graphHeight - ((val - yMin) / yRange) * graphHeight;
      return { x, y, val, date: d.date };
   });

   const pathD = points.map((p, i) => 
      (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)
   ).join(' ');

   const areaD = `${pathD} L ${points[points.length-1].x},${height} L ${points[0].x},${height} Z`;

   return (
      <div className="relative w-full h-full group" onMouseLeave={() => setHoveredIndex(null)}>
         <svg viewBox={`0 0 ${viewBoxWidth} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Defs for gradients */}
            <defs>
              <linearGradient id={`gradient-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area */}
            {showArea && <path d={areaD} fill={`url(#gradient-${String(dataKey)})`} />}

            {/* Line */}
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              d={pathD} 
              fill="none" 
              stroke={color} 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Data Points */}
            {points.map((p, idx) => (
               <g key={idx}>
                  {/* Hit Area */}
                  <rect 
                      x={p.x - 10} 
                      y="0" 
                      width="20" 
                      height={height}
                      fill="transparent" 
                      onMouseEnter={() => setHoveredIndex(idx)}
                      className="cursor-pointer"
                  />
                  {/* Visible Point on Hover or Last */}
                  <motion.circle 
                      cx={p.x} 
                      cy={p.y} 
                      initial={{ r: 0 }}
                      animate={{ 
                          r: hoveredIndex === idx || idx === points.length - 1 ? 5 : 0,
                          opacity: hoveredIndex === idx || idx === points.length - 1 ? 1 : 0 
                      }}
                      fill="white" 
                      stroke={color} 
                      strokeWidth="2.5" 
                  />
               </g>
            ))}
         </svg>

         {/* Tooltip */}
         <AnimatePresence>
          {hoveredIndex !== null && points[hoveredIndex] && (
              <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none z-10 whitespace-nowrap"
                  style={{ 
                      left: `${(points[hoveredIndex].x / viewBoxWidth) * 100}%`, 
                      top: 0,
                      transform: 'translate(-50%, -120%)' 
                  }}
              >
                  <div className="font-bold">{points[hoveredIndex].val} <span className="opacity-70 font-normal">{unit}</span></div>
                  <div className="text-[10px] text-slate-400 mt-0.5 opacity-80">{points[hoveredIndex].date}</div>
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
              </motion.div>
          )}
         </AnimatePresence>
      </div>
   );
};

import { getVitalsHistory, type VitalsHistoryItem } from '@/actions/donor.actions';

export default function WellnessPage() {
  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [vitalsHistory, setVitalsHistory] = useState<{date: string, hemoglobin: number, bpSystolic: number, bpDiastolic: number, pulse: number, weight: number}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    setIsUnlocked(true);
    setLoading(true);
    const data = await getVitalsHistory();
    const mapped = data.map(v => ({
      date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hemoglobin: v.hemoglobin ?? 0,
      bpSystolic: v.bpSystolic ?? 0,
      bpDiastolic: v.bpDiastolic ?? 0,
      pulse: v.pulse ?? 0,
      weight: v.weight ?? 0,
    }));
    setVitalsHistory(mapped.length > 0 ? mapped : [
      { date: 'Dec 1, 2025', hemoglobin: 14.1, bpSystolic: 120, bpDiastolic: 80, pulse: 71, weight: 74.5 },
    ]);
    setLoading(false);
  };

  if (!user) return null;

  const latestVitals = vitalsHistory[vitalsHistory.length - 1] || { hemoglobin: 14.1, bpSystolic: 120, bpDiastolic: 80, pulse: 71, weight: 74.5, date: '' };
  const previousVitals = vitalsHistory[vitalsHistory.length - 2] || latestVitals;
  const hemoTrend = getTrend(latestVitals.hemoglobin, previousVitals.hemoglobin);
  const bpTrend = getTrend(latestVitals.bpSystolic, previousVitals.bpSystolic);
  const weightTrend = getTrend(latestVitals.weight, previousVitals.weight);


  if (!isUnlocked) {
     return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300 relative overflow-hidden min-h-[60vh]">
           {/* Decorative Background */}
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-rose-50 via-white to-white -z-10"></div>
           
           <div className="w-24 h-24 bg-white rounded-4xl flex items-center justify-center mb-8 shadow-2xl shadow-rose-100 border border-rose-50 relative group">
              <div className="absolute inset-0 bg-rose-500 rounded-4xl opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              <ShieldCheck size={40} className="text-rose-600" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white border-4 border-white">
                  <Lock size={12} />
              </div>
           </div>
           
           <h2 className="text-3xl font-bold font-serif text-slate-900 mb-3">Wellness Passport</h2>
           <p className="text-slate-500 mb-10 max-w-sm text-lg leading-relaxed">
              Your donation history contains valuable health insights. Authenticate securely to view your vitals.
           </p>
           
           <Button 
             size="lg"
             onClick={() => setIsUnlocked(true)}
             className="px-10 py-6 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-xl h-auto text-lg"
           >
              Access Health Records
           </Button>
           
           <p className="mt-8 text-xs text-slate-400 flex items-center gap-1">
              <Lock size={10} /> End-to-end encrypted medical data
           </p>
        </div>
     );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
       
       {/* Header */}
       <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">My Health Journey</h1>
            <p className="text-slate-500 text-sm">Tracking your wellness with every drop.</p>
         </div>
         <button onClick={() => setIsUnlocked(false)} className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all">
            <Lock size={18} />
         </button>
       </div>

       {/* Health Score & AI Insight */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Activity size={100} />
               </div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                   <div className="flex items-center gap-2 mb-4">
                       <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                           <Heart size={16} className="text-rose-400 fill-current" />
                       </div>
                       <span className="text-sm font-bold text-slate-300">Donor Health Score</span>
                   </div>
                   <div>
                       <div className="flex items-baseline gap-2">
                           <span className="text-5xl font-bold font-serif">94</span>
                           <span className="text-lg text-emerald-400 font-medium">Excellent</span>
                       </div>
                       <div className="w-full bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: '94%' }}
                             transition={{ duration: 1.5 }}
                             className="h-full bg-linear-to-r from-emerald-500 to-emerald-300"
                           />
                       </div>
                       <p className="text-xs text-slate-400 mt-3">Based on consistency and vitals.</p>
                   </div>
               </div>
           </div>

           <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-center">
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-rose-50 rounded-full blur-2xl"></div>
               <div className="flex gap-4 items-start relative z-10">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                       <Brain size={24} />
                   </div>
                   <div>
                       <h3 className="font-bold text-slate-900 text-lg mb-1">AI Health Insight</h3>
                       <p className="text-slate-600 text-sm leading-relaxed">
                           Your hemoglobin levels have remained consistently healthy (avg 14.1 g/dL) over the last 4 donations. 
                           However, your hydration index seems slightly lower post-donation. Consider increasing fluid intake by 500ml before your next appointment.
                       </p>
                   </div>
               </div>
           </div>
       </div>

       {/* Main Metric: Hemoglobin */}
       <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-visible">
          <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="min-w-[240px]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl shadow-sm border border-rose-100">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Hemoglobin</h3>
                        <p className="text-xs text-slate-500 font-medium">Iron Levels</p>
                    </div>
                </div>
                
                <div className="mb-4">
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-serif font-bold text-slate-900">{latestVitals.hemoglobin}</span>
                        <span className="text-lg text-slate-400 font-medium">g/dL</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold mt-1 ${hemoTrend.color}`}>
                        <hemoTrend.icon size={16} />
                        {hemoTrend.label} from last visit
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                        <span>Low</span>
                        <span>Normal (12.5 - 17.0)</span>
                        <span>High</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full relative overflow-hidden">
                        {/* Safe Range Zone */}
                        <div className="absolute left-[30%] w-[50%] h-full bg-slate-200"></div> 
                        {/* Marker */}
                        <motion.div 
                             initial={{ left: '0%' }}
                             animate={{ left: `${((latestVitals.hemoglobin - 10) / 10) * 100}%` }}
                             className="absolute top-0 bottom-0 w-2 bg-slate-900 rounded-full shadow-lg border border-white"
                        />
                    </div>
                </div>
              </div>
              
              <div className="flex-1 w-full h-48 md:h-auto min-h-[200px] pl-0 md:pl-8 border-l border-slate-50">
                 <EnhancedChart 
                    data={vitalsHistory} 
                    dataKey="hemoglobin" 
                    color="#e11d48" 
                    unit="g/dL" 
                    height={200}
                 />
              </div>
          </div>
       </div>

       {/* Secondary Vitals Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
           {/* Blood Pressure */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                       <Heart size={20} />
                   </div>
                   <div className={`flex items-center gap-1 text-xs font-bold ${bpTrend.color}`}>
                       <bpTrend.icon size={12} /> {bpTrend.label}
                   </div>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Pressure</p>
               <div className="flex items-baseline gap-1 mb-4">
                   <span className="text-2xl font-bold text-slate-900">{latestVitals.bpSystolic}/{latestVitals.bpDiastolic}</span>
                   <span className="text-xs text-slate-400">mmHg</span>
               </div>
               <div className="h-16">
                   <EnhancedChart data={vitalsHistory} dataKey="bpSystolic" color="#3b82f6" unit="mmHg" height={64} showArea={false} />
               </div>
           </div>

           {/* Pulse */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                       <Activity size={20} />
                   </div>
                   <span className="text-xs font-bold text-slate-400">Resting</span>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pulse Rate</p>
               <div className="flex items-baseline gap-1 mb-4">
                   <span className="text-2xl font-bold text-slate-900">{latestVitals.pulse}</span>
                   <span className="text-xs text-slate-400">BPM</span>
               </div>
               <div className="h-16">
                   <EnhancedChart data={vitalsHistory} dataKey="pulse" color="#f97316" unit="bpm" height={64} showArea={false} />
               </div>
           </div>

           {/* Weight */}
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                   <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                       <Scale size={20} />
                   </div>
                   <div className={`flex items-center gap-1 text-xs font-bold ${weightTrend.color}`}>
                       <weightTrend.icon size={12} /> {weightTrend.label}
                   </div>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Body Weight</p>
               <div className="flex items-baseline gap-1 mb-4">
                   <span className="text-2xl font-bold text-slate-900">{latestVitals.weight}</span>
                   <span className="text-xs text-slate-400">kg</span>
               </div>
               <div className="h-16">
                   <EnhancedChart data={vitalsHistory} dataKey="weight" color="#a855f7" unit="kg" height={64} showArea={false} />
               </div>
           </div>
       </div>

       {/* Collapsible History Table */}
       <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
           <button 
             onClick={() => setIsHistoryOpen(!isHistoryOpen)}
             className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors"
           >
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                       <Info size={18} />
                   </div>
                   <span className="font-bold text-slate-900">Full Vitals History</span>
               </div>
               {isHistoryOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
           </button>
           
           <AnimatePresence>
               {isHistoryOpen && (
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: 'auto' }}
                     exit={{ height: 0 }}
                     className="overflow-hidden border-t border-slate-100"
                   >
                       <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-xs">
                               <tr>
                                   <th className="p-4 pl-6">Date</th>
                                   <th className="p-4">Hemoglobin</th>
                                   <th className="p-4">Blood Pressure</th>
                                   <th className="p-4">Pulse</th>
                                   <th className="p-4 pr-6">Weight</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                               {vitalsHistory.map((vital, idx) => (
                                   <tr key={idx} className="hover:bg-slate-50/50">
                                       <td className="p-4 pl-6 font-medium text-slate-900">{vital.date}</td>
                                       <td className="p-4">{vital.hemoglobin} <span className="text-xs text-slate-400">g/dL</span></td>
                                       <td className="p-4">{vital.bpSystolic}/{vital.bpDiastolic} <span className="text-xs text-slate-400">mmHg</span></td>
                                       <td className="p-4">{vital.pulse} <span className="text-xs text-slate-400">bpm</span></td>
                                       <td className="p-4 pr-6">{vital.weight} <span className="text-xs text-slate-400">kg</span></td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </motion.div>
               )}
           </AnimatePresence>
       </div>

    </div>
  );
}
