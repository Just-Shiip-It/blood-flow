"use client";

import React from 'react';
import { Settings, Key, Server, Bell, Shield, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">System Configuration</h1>
        <p className="text-slate-500 text-sm">Manage API keys, integrations, and audit logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Key, title: 'API Keys', desc: 'Manage third-party integrations and API access tokens.', color: 'bg-purple-50 text-purple-600' },
          { icon: Server, title: 'Integrations', desc: 'Configure EHR, lab systems, and transport logistics.', color: 'bg-blue-50 text-blue-600' },
          { icon: Bell, title: 'Notifications', desc: 'Set up alerts for critical events and thresholds.', color: 'bg-amber-50 text-amber-600' },
          { icon: Shield, title: 'Security', desc: 'Manage authentication settings and session policies.', color: 'bg-emerald-50 text-emerald-600' },
          { icon: Database, title: 'Backups', desc: 'Configure automated database backups and restore points.', color: 'bg-slate-100 text-slate-600' },
          { icon: Settings, title: 'General', desc: 'Manage system preferences and default configurations.', color: 'bg-rose-50 text-rose-600' },
        ].map((item, idx) => (
          <button
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-left group"
          >
            <div className={`p-3 rounded-xl w-fit mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4">Recent Audit Log</h3>
        <div className="space-y-3">
          {[
            { action: 'User role updated', user: 'admin@lifeflow.org', time: '2 hours ago' },
            { action: 'New facility registered', user: 'admin@lifeflow.org', time: '5 hours ago' },
            { action: 'API key regenerated', user: 'system', time: '1 day ago' },
            { action: 'Database backup completed', user: 'system', time: '1 day ago' },
          ].map((log, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-800">{log.action}</p>
                <p className="text-xs text-slate-400">by {log.user}</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
