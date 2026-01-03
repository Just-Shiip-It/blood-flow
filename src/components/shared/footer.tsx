"use client";

import React, { useState } from 'react';
import { Droplet, Facebook, Twitter, Instagram, Phone, Mail, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      // Reset success message after 5 seconds to allow another entry if needed
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Droplet className="w-8 h-8 text-rose-500 fill-current" />
              <span className="text-2xl font-bold font-serif tracking-tight">LifeFlow</span>
            </div>
            <p className="text-gray-400 mb-6">
              Connecting donors with those in need. Safe, fast, and compassionate blood donation services worldwide.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-rose-500 transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-rose-500 transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-rose-500 transition-colors"><Instagram className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/#process" className="hover:text-white transition-colors">Donation Process</Link></li>
              <li><Link href="/locations" className="hover:text-white transition-colors">Locate a Center</Link></li>
              <li><Link href="/eligibility" className="hover:text-white transition-colors">Eligibility Requirements</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-rose-500 shrink-0" />
                <span>123 Life Avenue, Health District, NY 10012</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-rose-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-rose-500 shrink-0" />
                <span>help@lifeflow.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for urgent donation alerts.</p>
            <form className="flex flex-col space-y-3" onSubmit={handleSubscribe}>
              {subscribed ? (
                <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 flex items-start gap-3 text-green-400 animate-in fade-in duration-300">
                  <Check size={20} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Success!</p>
                    <p className="text-xs opacity-80 mt-1">You&apos;ve been added to our alert list.</p>
                  </div>
                </div>
              ) : (
                <>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 text-white border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-rose-500 outline-none placeholder-gray-500"
                    required
                  />
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white" type="submit">Subscribe</Button>
                </>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; 2024 LifeFlow Organization. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
