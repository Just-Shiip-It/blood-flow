"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Stethoscope, Heart, Coffee } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    title: "Registration",
    desc: "Sign up, fill out a basic health history questionnaire, and show ID."
  },
  {
    icon: Stethoscope,
    title: "Mini-Physical",
    desc: "We check your temperature, pulse, blood pressure and hemoglobin levels."
  },
  {
    icon: Heart,
    title: "The Donation",
    desc: "Sit back and relax. The actual donation only takes 8-10 minutes."
  },
  {
    icon: Coffee,
    title: "Refreshments",
    desc: "Enjoy a snack and drink to replenish your fluids before you leave."
  }
];

export const Process: React.FC = () => {
  return (
    <section id="process" className="py-24 bg-slate-50 relative overflow-hidden">
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-rose-600 font-bold uppercase tracking-wider text-sm mb-2 block">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
            From You to Them in 4 Steps
          </h2>
          <p className="text-slate-600 text-lg">
             We make the process safe, fast, and comfortable. Here is what you can expect when you arrive at one of our centers.
          </p>
        </div>

        <div className="relative">
          {/* Dashed Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-slate-300 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-300">
                   <div className="absolute inset-0 bg-rose-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                   <step.icon size={32} className="text-rose-600 relative z-10" />
                   
                   {/* Step Number Badge */}
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-slate-50">
                      {index + 1}
                   </div>
                </div>

                <h4 className="text-xl font-bold text-slate-900 mb-3 font-serif">{step.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm px-4">
                  {step.desc}
                </p>
                
                {/* Mobile Connector */}
                {index !== steps.length - 1 && (
                  <div className="lg:hidden absolute -bottom-12 left-1/2 w-0.5 h-8 border-l-2 border-dashed border-slate-300"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
