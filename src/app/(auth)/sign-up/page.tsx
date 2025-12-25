"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplet, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });
      
      if (result.error) {
        setError(result.error.message || 'Something went wrong. Please try again.');
        setLoading(false);
      } else {
        // Success - redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative"
      >
        <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors">
           <ArrowLeft size={24} />
        </Link>

        <div className="text-center mb-8">
           <div className="inline-flex p-3 bg-rose-100 text-rose-600 rounded-xl mb-4">
            <Droplet size={32} className="fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Join LifeFlow</h2>
          <p className="text-gray-500">Become a donor and save lives</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
            <Input 
              id="name"
              type="text" 
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border-gray-200 focus:ring-rose-200 focus:border-rose-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
            <Input 
              id="email"
              type="email" 
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-gray-200 focus:ring-rose-200 focus:border-rose-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <Input 
              id="password"
              type="password" 
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border-gray-200 focus:ring-rose-200 focus:border-rose-500"
            />
          </div>
          
          <Button className="w-full h-12 text-base font-bold rounded-xl bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 mt-4" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : 'Register'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-rose-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
