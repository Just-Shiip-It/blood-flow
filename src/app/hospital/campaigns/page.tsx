"use client";

import React from 'react';
import { Megaphone, CalendarDays, Users, Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HospitalCampaignsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Campaign Management</h1>
          <p className="text-slate-500 text-sm">Organize blood drives and community outreach programs.</p>
        </div>
        <Button className="bg-rose-600 hover:bg-rose-700">
          <Plus size={16} className="mr-2" /> New Campaign
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Megaphone size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Active Campaigns</p>
            <p className="text-2xl font-bold text-slate-900">3</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Scheduled</p>
            <p className="text-2xl font-bold text-slate-900">5</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Signups</p>
            <p className="text-2xl font-bold text-slate-900">248</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Goal Progress</p>
            <p className="text-2xl font-bold text-slate-900">72%</p>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Upcoming Campaigns</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Winter Blood Drive 2024', date: 'Jan 15-20, 2024', location: 'Main Campus', goal: 500, signups: 320, status: 'Active' },
            { name: 'Corporate Partnership - TechCorp', date: 'Feb 5, 2024', location: 'TechCorp HQ', goal: 100, signups: 45, status: 'Scheduled' },
            { name: 'Community Health Fair', date: 'Feb 12, 2024', location: 'City Park Pavilion', goal: 200, signups: 0, status: 'Planning' },
          ].map((campaign, idx) => (
            <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">{campaign.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} /> {campaign.date}
                  </span>
                  <span>📍 {campaign.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Signups</p>
                  <p className="font-bold text-slate-900">{campaign.signups}/{campaign.goal}</p>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(campaign.signups / campaign.goal) * 100}%` }}
                    />
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  campaign.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                  campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {campaign.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
