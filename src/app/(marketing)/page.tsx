import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { Features } from "@/components/home/features";
import { Process } from "@/components/home/process";
import { Testimonials } from "@/components/home/testimonials";
import { EligibilityChat } from "@/components/home/eligibility-chat";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <Process />
      <Testimonials />
      <EligibilityChat />
    </>
  );
}
