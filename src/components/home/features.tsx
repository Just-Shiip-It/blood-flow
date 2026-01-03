"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Activity, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const Features: React.FC = () => {
  return (
    <section id="why-donate" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          <motion.div 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="lg:w-1/2 relative"
          >
             <div className="relative rounded-4xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop" 
                  alt="Nurse holding donor hand" 
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                   <p className="text-3xl font-serif font-bold mb-2">&quot;The Universal Gift&quot;</p>
                   <p className="text-slate-200 text-lg">Type O Negative donors are universal heroes, essential in emergencies.</p>
                </div>
             </div>
             
             {/* Decorative blob */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-rose-50 rounded-full blur-3xl opacity-60"></div>
          </motion.div>

          <motion.div 
             className="lg:w-1/2"
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <span className="text-rose-600 font-bold uppercase tracking-wider text-sm mb-2 block">Why It Matters</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              Your Blood is Replaceable. <br/> A Life is Not.
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Blood cannot be manufactured; it can only come from generous donors like you. A single donation can save up to three lives, aiding accident victims, cancer patients, and surgery candidates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
               {[
                 { icon: Activity, title: "Free Health Checkup", desc: "Pulse, BP, temp & hemoglobin check." },
                 { icon: Heart, title: "Heart Health", desc: "Lowers iron levels, reducing heart attack risk." },
                 { icon: Smile, title: "Mood Booster", desc: "The joy of saving a life reduces stress." },
                 { icon: Shield, title: "Community Safety", desc: "Ensures supply for local emergencies." }
               ].map((item, idx) => (
                 <div key={idx} className="flex flex-col gap-3">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                       <item.icon size={24} />
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                       <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <Button variant="outline" size="lg" asChild>
                <Link href="/impact">Learn More About Impact</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
