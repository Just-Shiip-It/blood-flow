"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Droplet, Clock, HeartHandshake } from 'lucide-react';

const stats = [
  { icon: Droplet, value: "15,000+", label: "Units Collected", color: "text-rose-600", bg: "bg-rose-50" },
  { icon: HeartHandshake, value: "45,000+", label: "Lives Impacted", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Users, value: "8,200", label: "Registered Donors", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Clock, value: "45m", label: "Avg. Donation Time", color: "text-emerald-600", bg: "bg-emerald-50" },
];

export const Stats: React.FC = () => {
  return (
    <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 container mx-auto mb-24">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-x-0 lg:divide-x divide-slate-100">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-default px-4"
            >
              <div className={`p-4 rounded-2xl mb-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110 ${stat.bg}`}>
                <stat.icon size={32} className={stat.color} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-2">{stat.value}</h3>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Stats;
