"use client";

import React, { useState, useEffect } from 'react';
import { Droplet, Menu, X, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Why Donate', href: '#why-donate' },
    { name: 'Process', href: '#process' },
    { name: 'Eligibility', href: '/#eligibility' },
    { name: 'Blog', href: '/blog' },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // If it's an anchor link on the same page, scroll to it
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || mobileMenuOpen ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center space-x-2"
          >
            <div className={cn(
              "p-2 rounded-lg transition-colors",
              isScrolled ? "bg-rose-50 text-rose-600" : "bg-white text-rose-600"
            )}>
              <Droplet className="w-6 h-6 fill-current" />
            </div>
            <span className={cn(
              "text-2xl font-bold font-serif tracking-tight",
              isScrolled ? "text-slate-900" : "text-slate-900" 
            )}>
              LifeFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className={cn(
                  "text-sm font-medium hover:text-rose-600 transition-colors",
                  isScrolled ? "text-slate-600" : "text-slate-700"
                )}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard">
                  <User className="w-4 h-4 mr-2" />
                  My Portal
                </Link>
              </Button>
            ) : (
              <Button size="sm" className="shadow-none" asChild>
                 <Link href="/sign-in">
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Sign In
                 </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 top-full shadow-lg h-screen animate-in slide-in-from-top-2">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="block text-base font-medium text-slate-700 hover:text-rose-600"
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-100">
               {isLoggedIn ? (
                 <Button className="w-full" asChild>
                   <Link href="/dashboard">Go to Portal</Link>
                 </Button>
               ) : (
                 <Button className="w-full" asChild>
                   <Link href="/sign-in">Sign In</Link>
                 </Button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
