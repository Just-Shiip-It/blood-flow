"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Droplets, 
  Heart, 
  Trophy, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getDonationHistory, getDonorBadges, type DonationHistoryItem } from '@/actions/donor.actions';

export default function HistoryPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationHistoryItem[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const [donationData, badgeData] = await Promise.all([
          getDonationHistory(),
          getDonorBadges(),
        ]);
        setDonations(donationData);
        setBadges(badgeData);
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const totalDonations = donations.length;
  const livesSaved = totalDonations * 3;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-900">Donation History</h1>
        <p className="text-stone-500 text-sm">Track your life-saving journey.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Total Donations</p>
            <p className="text-2xl font-bold text-stone-900">{totalDonations}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Heart size={24} className="fill-red-100" />
          </div>
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Lives Impacted</p>
            <p className="text-2xl font-bold text-stone-900">{livesSaved}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Badges Earned</p>
            <p className="text-2xl font-bold text-stone-900">{badges.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">Your Donations</h2>
        
        {donations.length > 0 ? (
          <div className="space-y-3">
            {donations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{donation.center.name}</p>
                      <div className="flex items-center gap-3 text-sm text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {donation.donatedAt 
                            ? new Date(donation.donatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {donation.center.city}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      Completed
                    </span>
                    <p className="text-sm text-stone-500 mt-2">
                      {donation.volumeMl} ml
                    </p>
                  </div>
                </div>

                {/* Screening Info */}
                {donation.screening && (
                  <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-stone-400 text-xs uppercase">Hemoglobin</p>
                      <p className="font-bold text-stone-700">{donation.screening.hemoglobin} g/dL</p>
                    </div>
                    <div>
                      <p className="text-stone-400 text-xs uppercase">Blood Pressure</p>
                      <p className="font-bold text-stone-700">{donation.screening.systolicBP}/{donation.screening.diastolicBP}</p>
                    </div>
                    <div>
                      <p className="text-stone-400 text-xs uppercase">Pulse</p>
                      <p className="font-bold text-stone-700">{donation.screening.pulseRate} bpm</p>
                    </div>
                    <div>
                      <p className="text-stone-400 text-xs uppercase">Weight</p>
                      <p className="font-bold text-stone-700">{donation.screening.weight} kg</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-stone-100 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <History size={32} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">No donation history</h3>
            <p className="text-stone-500 max-w-sm mx-auto">
              You haven't made any donations yet. Your journey is just beginning!
            </p>
          </div>
        )}
      </div>

      {/* Badges Section */}
      {badges.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm text-center"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <Trophy size={24} />
                </div>
                <p className="font-bold text-stone-900 text-sm">{badge.name}</p>
                <p className="text-xs text-stone-500 mt-1">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
