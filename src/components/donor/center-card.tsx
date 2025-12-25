import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type DonationCenter } from "@/types";
import { MapPin, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CenterCardProps {
  center: DonationCenter;
  className?: string;
}

export function CenterCard({ center, className }: CenterCardProps) {
  // Parse operating hours if it's a JSON string or object
  const hours = center.operatingHours as Record<string, string> | null;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = hours ? hours[today] || "Closed" : "9:00 AM - 5:00 PM";

  return (
    <Card className={cn("flex flex-col h-full hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              {center.type.replace('_', ' ')}
            </div>
            <CardTitle className="text-xl">{center.name}</CardTitle>
          </div>
          <div className={cn(
            "px-2 py-1 rounded text-xs font-bold",
            center.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {center.isActive ? "Open" : "Closed"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{center.address}, {center.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{center.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Today: {todayHours}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/appointments/book?centerId=${center.id}`}>Book Appointment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
