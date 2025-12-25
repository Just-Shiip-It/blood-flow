"use client";

import React, { useState, useEffect } from 'react';
import { Droplet, Menu, X, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Why Donate', href: '/#why-donate' },
    { name: 'Process', href: '/#process' },
    { name: 'Eligibility', href: '/check-eligibility' }, 
    { name: 'Blog', href: '/blog' },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (pathname === '/' && href.startsWith('/#')) {
        e.preventDefault();
        const elementId = href.replace('/#', '');
        const element = document.getElementById(elementId);
        element?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };
    
  const isBlog = pathname?.startsWith('/blog');
  // Use distinct style for blog or scrolled pages
  const isTransparent = !isScrolled && !mobileMenuOpen && !isBlog;

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3",
        !isTransparent ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className={cn(
                "p-2 rounded-lg",
                 !isTransparent ? "bg-rose-50 text-rose-600" : "bg-white text-rose-600"
            )}>
              <Droplet className="w-6 h-6 fill-current" />
            </div>
            <span className={cn(
                "text-2xl font-bold font-serif tracking-tight",
                !isTransparent ? "text-gray-900" : "text-gray-900 bg-white/50 backdrop-blur-sm px-2 rounded-lg"
            )}>
              LifeFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                className={cn(
                    "text-sm font-medium transition-colors hover:text-rose-600",
                    (isBlog && link.href === '/blog') ? "text-rose-600 font-bold" : 
                    !isTransparent ? "text-gray-600" : "text-gray-800"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            {isLoggedIn ? (
                <Button size="sm" variant={!isTransparent ? "outline" : "secondary"} asChild>
                    <Link href="/dashboard">
                        <User className="w-4 h-4 mr-2" />
                        My Portal
                    </Link>
                </Button>
            ) : (
                <Button size="sm" variant={!isTransparent ? "default" : "default"}  className="shadow-none" asChild>
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
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-full shadow-lg h-screen animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="block text-base font-medium text-gray-700 hover:text-rose-600"
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
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
}
