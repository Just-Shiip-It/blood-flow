"use client";

import React from 'react';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "James Carter",
    role: "Regular Donor (O+)",
    quote: "My daughter needed blood when she was born. Since then, I promised to give back as much as I can. The staff here makes it so easy and comfortable.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    role: "First Time Donor",
    quote: "I was terrified of needles, but the nurses were so gentle and kind. Knowing I helped save a life makes every second worth it. I'll definitely be back.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Dr. A. Patel",
    role: "Hematologist",
    quote: "We see the impact every day in the ER. Your donation is not just blood; it is liquid life. We are forever grateful to our community of donors.",
    image: "https://randomuser.me/api/portraits/men/86.jpg"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-600 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-rose-400 font-bold uppercase tracking-wider text-sm mb-2 block">Community Voices</span>
          <h2 className="text-3xl font-bold font-serif sm:text-5xl mb-6">Stories of Hope</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
             Real stories from our community of heroes and the lives they touch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700 hover:border-rose-500/30 transition-all duration-300 hover:transform hover:-translate-y-2 group">
              <div className="flex gap-1 text-amber-400 mb-6">
                 {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <Quote className="w-10 h-10 text-rose-500 mb-6 opacity-50" />
              <p className="text-lg text-slate-200 mb-8 leading-relaxed">&quot;{t.quote}&quot;</p>
              
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-700/50">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full border-2 border-slate-600 group-hover:border-rose-500 transition-colors" 
                />
                <div>
                  <h4 className="font-bold text-white font-serif">{t.name}</h4>
                  <p className="text-rose-300 text-sm font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
