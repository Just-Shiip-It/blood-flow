import Link from "next/link";
import { Activity, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--color-secondary),_transparent)]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Save a Life, <span className="text-primary">Donate Blood</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Your donation can be a lifeline for someone in need. Schedule an appointment today at a nearby center.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/sign-up">Register as Donor</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/centers">Find a Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center bg-white dark:bg-slate-950">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-4 p-6 premium-card">
              <div className="p-3 bg-secondary rounded-full">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Register</h3>
              <p className="text-muted-foreground">Create your profile with basic health details and join our network of heroes.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 premium-card">
              <div className="p-3 bg-secondary rounded-full">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Find & Book</h3>
              <p className="text-muted-foreground">Locate nearby hospitals or donation camps and book a convenient time slot.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 premium-card">
              <div className="p-3 bg-secondary rounded-full">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Verified Process</h3>
              <p className="text-muted-foreground">Experience a safe, professional donation process with pre-screening and care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-12 md:py-24 flex justify-center items-center">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-4">About Vitals</h2>
              <p className="text-muted-foreground mb-4">
                Vitals is a comprehensive Blood Donation Management System designed to connect donors with hospitals and blood banks seamlessly.
              </p>
              <p className="text-muted-foreground">
                Our platform ensures a safe, efficient, and rewarding donation experience—from booking appointments to earning recognition for your contributions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="premium-card p-6 text-center">
                <div className="text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Donors</div>
              </div>
              <div className="premium-card p-6 text-center">
                <div className="text-4xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Partner Centers</div>
              </div>
              <div className="premium-card p-6 text-center">
                <div className="text-4xl font-bold text-primary">25K+</div>
                <div className="text-sm text-muted-foreground">Lives Saved</div>
              </div>
              <div className="premium-card p-6 text-center">
                <div className="text-4xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
