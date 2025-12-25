"use client";

import { useAuth } from "@/hooks/use-auth";
import { 
  Plus, 
  Droplet, 
  CalendarCheck, 
  Award, 
  ChevronRight,
  Clock,
  Heart
} from "lucide-react";
import Link from "next/link";

export default function DonorDashboard() {
  const { user } = useAuth();
  
  // Mock data for initial UI - will be replaced by API calls
  const stats = [
    { name: "Total Donations", value: "4", icon: Droplet, color: "text-red-500" },
    { name: "Next Eligibility", value: "Jan 15, 2026", icon: Clock, color: "text-blue-500" },
    { name: "Lives Saved", value: "12", icon: Heart, color: "text-pink-500" },
    { name: "Reward Points", value: "450", icon: Award, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="premium-card p-6 flex flex-col items-center text-center space-y-2">
            <div className={`p-3 bg-secondary/50 rounded-full ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              {stat.name}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">
          <section className="premium-card overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Upcoming Appointment</h2>
              <Link href="/appointments" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                Manage <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-6">
              {/* Conditional rendering for appointments */}
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full">
                  <CalendarCheck className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">No appointments scheduled</h3>
                  <p className="text-sm text-muted-foreground">You haven't booked any donation slots yet.</p>
                </div>
                <Link href="/appointments/book" className="btn-primary flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Book Now
                </Link>
              </div>
            </div>
          </section>

          <section className="premium-card">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold">Recent Donations</h2>
            </div>
            <div className="p-0">
               {/* Donor History List would go here */}
               <div className="p-6 text-center text-muted-foreground italic text-sm">
                 No donation history found yet. Start your journey today!
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <section className="premium-card p-6 bg-primary text-primary-foreground">
            <h3 className="font-bold mb-2">Did You Know?</h3>
            <p className="text-sm opacity-90 leading-relaxed mb-4">
              A single blood donation can save up to three lives. Your contribution makes a real difference in your community.
            </p>
            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-2/3" />
            </div>
            <p className="text-[10px] mt-2 text-white/70 italic">
              "Every drop counts."
            </p>
          </section>
          
          <section className="premium-card p-6 space-y-4">
            <h3 className="font-bold">Next Milestone</h3>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-100 rounded-lg">
                 <Award className="h-6 w-6 text-amber-600" />
               </div>
               <div>
                  <div className="text-sm font-semibold">Silver Donor Badge</div>
                  <div className="text-xs text-muted-foreground">1 donation away</div>
               </div>
            </div>
            <div className="pt-2">
              <Link href="/card" className="w-full inline-flex items-center justify-center p-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
                View Donor Card
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Simple Helper for the icon since I forgot I can't import Heart twice easily if I'm not careful,
// but actually Lucide Heart is fine. Wait, I used HeartIcon which is a typo for Heart.

