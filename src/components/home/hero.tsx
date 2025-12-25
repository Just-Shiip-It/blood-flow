"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ChevronRight, ShieldCheck, Activity } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-rose-50 to-white pt-32 pb-32 lg:pt-48 lg:pb-48">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-linear-to-l from-rose-100/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-linear-to-t from-orange-50/50 to-transparent pointer-events-none rounded-tr-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ y: y2 }}
            className="lg:col-span-6 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-rose-100 shadow-sm text-rose-700 font-semibold text-xs uppercase tracking-wider mb-8 mx-auto lg:mx-0"
            >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Urgent Need: Type O- & B-
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.1] mb-6">
              Your blood is <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-500">someone&apos;s lifeline.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
              Join a community of everyday heroes. Safe, simple, and impactful—your donation takes just 15 minutes but gives a lifetime to someone in need.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="shadow-xl shadow-rose-500/20 px-8 h-14 text-lg bg-rose-600 hover:bg-rose-700">
                <Link href="/schedule">
                  Book Appointment
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="h-14 text-lg border-slate-200 text-slate-700">
                Check Eligibility
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
               <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                 <ShieldCheck className="text-emerald-500" size={18} />
                 Safe & Sterile
               </div>
               <div className="w-px h-4 bg-slate-300"></div>
               <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                 <Activity className="text-blue-500" size={18} />
                 Free Health Check
               </div>
            </div>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ y: y1 }}
            className="mt-16 lg:mt-0 lg:col-span-6 relative hidden md:block"
          >
            <div className="relative z-10">
               {/* Main Image Card */}
               <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-900/10 border-[6px] border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="https://media.istockphoto.com/id/1757606871/photo/black-businessman-donating-blood-for-people-in-need-in-bright-hospital-female-nurse-with.jpg?s=612x612&w=0&k=20&c=w3PAMMJqOivqa0Z_v21eSIg6MnJD-k-iFeLEwMbKuCE=" 
                    alt="Comfortable blood donation" 
                    className="w-full h-[600px] object-cover"
                  />
                  
                  {/* Floating Card: Donor Story */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                           <Heart className="fill-current" size={24} />
                        </div>
                        <div>
                           <p className="font-bold text-slate-900 text-lg">&quot;Easier than I thought!&quot;</p>
                           <p className="text-slate-500 text-sm">Sarah, 12th time donor</p>
                        </div>
                     </div>
                  </motion.div>
               </div>

               {/* Decorative Elements */}
               <div className="absolute -top-12 -right-12 w-24 h-24 bg-rose-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
               <div className="absolute top-1/2 -left-12 w-32 h-32 bg-orange-300 rounded-full blur-3xl opacity-30"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
