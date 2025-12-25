"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Shield,
  User,
  Stethoscope,
  MoreVertical,
  Plus,
  Clock,
  AlertCircle,
  X,
  Edit2,
  Key,
  Ban,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const USERS = [
  { id: 1, name: 'Dr. Sarah Connor', email: 's.connor@lifeflow.org', role: 'Staff', department: 'Hematology', status: 'Active', lastActive: '2 mins ago' },
  { id: 2, name: 'James T. Kirk', email: 'james.t@lifeflow.org', role: 'Admin', department: 'Operations', status: 'Active', lastActive: '1 hour ago' },
  { id: 3, name: 'Ellen Ripley', email: 'e.ripley@lifeflow.org', role: 'Staff', department: 'Logistics', status: 'On Leave', lastActive: '3 days ago' },
  { id: 4, name: 'John Doe', email: 'j.doe@example.com', role: 'Donor', department: '-', status: 'Active', lastActive: '5 hours ago' },
  { id: 5, name: 'Jane Smith', email: 'jane.s@lifeflow.org', role: 'Staff', department: 'Nursing', status: 'Suspended', lastActive: '1 week ago' },
  { id: 6, name: 'Leonard McCoy', email: 'bones@lifeflow.org', role: 'Staff', department: 'General', status: 'Active', lastActive: '10 mins ago' },
];

export default function AdminUsersPage() {
  const [filterRole, setFilterRole] = useState('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveActionId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const getRoleBadge = (role: string) => {
     switch(role) {
        case 'Admin': return <span className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-bold border border-purple-100"><Shield size={12} /> Admin</span>;
        case 'Staff': return <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-100"><Stethoscope size={12} /> Staff</span>;
        default: return <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200"><User size={12} /> Donor</span>;
     }
  };

  const getStatusIndicator = (status: string) => {
      switch(status) {
          case 'Active': return <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active</span>;
          case 'On Leave': return <span className="flex items-center gap-1.5 text-amber-600 text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> On Leave</span>;
          case 'Suspended': return <span className="flex items-center gap-1.5 text-red-600 text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Suspended</span>;
          default: return <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Offline</span>;
      }
  };

  const filteredUsers = USERS.filter(u => filterRole === 'All' || u.role === filterRole);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
       
       {/* Stats Header */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
               <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
                   <p className="text-2xl font-bold text-slate-900">2,492</p>
               </div>
               <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                   <User size={20} />
               </div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
               <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Staff</p>
                   <p className="text-2xl font-bold text-slate-900">145</p>
               </div>
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                   <Stethoscope size={20} />
               </div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
               <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admins</p>
                   <p className="text-2xl font-bold text-slate-900">8</p>
               </div>
               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                   <Shield size={20} />
               </div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
               <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approval</p>
                   <div className="flex items-center gap-2">
                       <p className="text-2xl font-bold text-slate-900">12</p>
                       <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Action Req</span>
                   </div>
               </div>
               <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                   <AlertCircle size={20} />
               </div>
           </div>
       </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden relative">
         {/* Toolbar */}
         <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                 {['All', 'Staff', 'Admin', 'Donor'].map(role => (
                     <button
                        key={role}
                        onClick={() => setFilterRole(role)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            filterRole === role 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                     >
                         {role}
                     </button>
                 ))}
             </div>

             <div className="flex gap-3 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-200 outline-none transition-all focus:bg-white"
                    />
                 </div>
                 <Button size="sm" className="bg-slate-900 hover:bg-slate-800" onClick={() => setIsInviteModalOpen(true)}>
                     <Plus size={16} className="mr-2" /> Invite User
                 </Button>
             </div>
         </div>

         <div className="overflow-x-auto flex-1 min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm">
                   <tr>
                      <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Dept</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
                      <th className="p-4 pr-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group relative">
                         <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-white ${
                                   user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                                   user.role === 'Staff' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                               }`}>
                                  {user.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                                  <p className="text-xs text-slate-500 flex items-center gap-1">
                                      {user.email}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="flex flex-col items-start gap-1">
                                {getRoleBadge(user.role)}
                                <span className="text-xs text-slate-500 pl-1">{user.department !== '-' ? user.department : 'N/A'}</span>
                            </div>
                         </td>
                         <td className="p-4">
                            {getStatusIndicator(user.status)}
                         </td>
                         <td className="p-4 text-sm text-slate-600 font-mono">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-slate-400" />
                                {user.lastActive}
                            </div>
                         </td>
                         <td className="p-4 pr-6 text-right">
                            <div className="relative">
                               <button 
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     setActiveActionId(activeActionId === user.id ? null : user.id);
                                 }}
                                 className={`p-2 rounded-lg transition-colors ${activeActionId === user.id ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                               >
                                  <MoreVertical size={18} />
                               </button>

                               {activeActionId === user.id && (
                                   <div className="absolute right-8 top-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 flex flex-col p-1 text-left animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                       <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium">
                                           <Edit2 size={14} /> Edit Profile
                                       </button>
                                       <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors font-medium">
                                           <Key size={14} /> Reset Password
                                       </button>
                                       <div className="h-px bg-slate-100 my-1"></div>
                                       <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                                           <Ban size={14} /> Suspend User
                                       </button>
                                   </div>
                               )}
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
         </div>
         
         <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
             <p className="text-xs text-slate-500">Showing {filteredUsers.length} of 2,492 users</p>
             <div className="flex gap-2">
                 <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                 <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">Next</button>
             </div>
         </div>
      </div>

      {/* Invite User Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
           <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
              >
                 <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <h3 className="font-bold text-lg text-slate-900 font-serif">Invite New User</h3>
                     <button onClick={() => setIsInviteModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                 </div>
                 
                 <div className="p-6 space-y-4 overflow-y-auto">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                       <Input placeholder="e.g. Jane Doe" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                       <Input type="email" placeholder="jane@lifeflow.org" />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                           <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none bg-white">
                              <option>Staff Member</option>
                              <option>Administrator</option>
                              <option>Read-Only Auditor</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                           <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none" placeholder="e.g. Hematology" />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Access Permissions</label>
                        <div className="space-y-2">
                           <label className="flex items-center gap-2 text-sm text-slate-600">
                              <input type="checkbox" className="rounded text-slate-900 focus:ring-slate-500" defaultChecked />
                              View Patient Records
                           </label>
                           <label className="flex items-center gap-2 text-sm text-slate-600">
                              <input type="checkbox" className="rounded text-slate-900 focus:ring-slate-500" defaultChecked />
                              Manage Inventory
                           </label>
                           <label className="flex items-center gap-2 text-sm text-slate-600">
                              <input type="checkbox" className="rounded text-slate-900 focus:ring-slate-500" />
                              System Configuration (Admin)
                           </label>
                        </div>
                     </div>
                 </div>

                 <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                     <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>Cancel</Button>
                     <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => setIsInviteModalOpen(false)}>
                        <Send size={16} className="mr-2" /> Send Invitation
                     </Button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
