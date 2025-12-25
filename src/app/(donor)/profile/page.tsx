"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck, User as UserIcon, Phone, MapPin, Fingerprint, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  bloodType: z.string().optional(),
  citizenId: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      bloodType: user?.bloodType || "",
      citizenId: user?.citizenId || "",
      address: user?.address || "",
      city: user?.city || "",
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    // In a real app, call a server action or API to update profile
    console.log("Updating profile:", values);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/20">
          {user?.name?.[0] || 'D'}
        </div>
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal and health information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Verification Status */}
        <div className="md:col-span-1 space-y-6">
          <div className="premium-card p-6 border-l-4 border-l-primary">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Verification Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email Verified</span>
                <span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-0.5 rounded-full">Yes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Identity Verified</span>
                <span className="text-amber-600 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed italic">
                * To be fly verified, please provide your Citizen ID and visit a donation center for physical verification.
              </p>
            </div>
          </div>
          
          <div className="premium-card p-6 bg-slate-900 text-white">
            <h3 className="font-bold mb-2">Security Tip</h3>
            <p className="text-xs opacity-70 leading-relaxed">
              Keep your profile updated with correct blood type and contact details to ensure swift processing at center check-ins.
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:col-span-2">
          <form className="premium-card p-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </label>
                <input
                  {...register("name")}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  Blood Type
                </label>
                <select
                  {...register("bloodType")}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-muted-foreground" />
                  Citizen ID / Passport
                </label>
                <input
                  {...register("citizenId")}
                  placeholder="ID-12345678"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </label>
                <input
                  {...register("phone")}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Home Address
                </label>
                <input
                  {...register("address")}
                  placeholder="123 Health St, Medical District"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              {success && (
                <p className="text-sm text-green-600 font-medium animate-in fade-in">
                  Profile updated successfully!
                </p>
              )}
              <div className="flex gap-4 ml-auto">
                 <button
                   type="button"
                   className="px-4 py-2 rounded-lg border hover:bg-secondary transition-colors"
                 >
                   Discard Changes
                 </button>
                 <button
                   type="submit"
                   disabled={!isDirty}
                   className="btn-primary"
                 >
                   Save Profile
                 </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
