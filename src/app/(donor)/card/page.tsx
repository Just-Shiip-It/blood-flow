import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-utils";
import { ShieldCheck, QrCode } from "lucide-react";

export default async function DonationCardPage() {
  const user = await requireAuth();

  return (
    <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Digital Donor Card</h1>
        <p className="text-muted-foreground">Show this card at donation centers.</p>
      </div>

      <div className="w-full max-w-md perspective-1000">
        <div className="relative w-full aspect-[1.586] rounded-xl bg-linear-to-br from-red-600 to-red-800 text-white p-6 shadow-2xl transition-transform hover:scale-105">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <ShieldCheck className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6" />
                 <span className="font-bold text-lg tracking-wider">VITALS</span>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded text-sm font-semibold backdrop-blur-sm">
                DONOR
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-red-100 text-xs uppercase tracking-wider mb-1">Name</p>
                  <p className="text-xl font-medium tracking-wide">{user.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-100 text-xs uppercase tracking-wider mb-1">Blood Type</p>
                  <p className="text-3xl font-bold">{user.bloodType?.replace(/([+-])/, ' $1') || '--'}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                <div>
                  <p className="text-red-100 text-xs uppercase tracking-wider mb-1">Donor ID</p>
                  <p className="font-mono text-sm tracking-widest">{user.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="h-8 w-8 bg-white/90 rounded flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground max-w-md">
        This is an official digital donor card. It serves as proof of your registration with the Vitals blood donation network.
      </p>
    </div>
  );
}
