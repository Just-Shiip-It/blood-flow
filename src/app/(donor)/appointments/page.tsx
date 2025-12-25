import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { getUpcomingAppointments } from "@/actions/donor-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { requireAuth } from "@/lib/auth-utils";
import { AppointmentWithCenter } from "@/types";
import { AppointmentStatus } from "@/lib/constants";

export default async function AppointmentsPage() {
  const user = await requireAuth();
  
  // Fetch data directly in server component
  const appointments = await getUpcomingAppointments(user.id);
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage your donation appointments.</p>
        </div>
        <Button asChild>
          <Link href="/appointments/book">Book New Appointment</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {appointments && appointments.length > 0 ? (
          appointments.map((apt: AppointmentWithCenter) => (
            <Card key={apt.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{apt.center.name}</CardTitle>
                    <CardDescription>{apt.center.address}, {apt.center.city}</CardDescription>
                  </div>
                  <StatusBadge status={apt.status as AppointmentStatus} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(apt.scheduledDate).toLocaleDateString()} at {apt.timeSlot}
                    </span>
                  </div>
                  {/* Cancel/Reschedule buttons could go here */}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium">No upcoming appointments</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You don't have any appointments scheduled. Book one today to help save lives.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/appointments/book">Book Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
