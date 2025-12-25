import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function HospitalDashboard() {
  // Mock data - will be replaced with server actions
  const stats = [
    { name: "Today's Appointments", value: "24", icon: Users, color: "text-blue-500" },
    { name: "Checked In", value: "8", icon: Clock, color: "text-amber-500" },
    { name: "Completed", value: "12", icon: CheckCircle, color: "text-green-500" },
    { name: "Pending Action", value: "4", icon: AlertTriangle, color: "text-red-500" },
  ];

  const queue = [
    { id: "1", name: "John Smith", time: "09:00 AM", status: "checked_in", bloodType: "A+" },
    { id: "2", name: "Sarah Johnson", time: "09:30 AM", status: "screening", bloodType: "O-" },
    { id: "3", name: "Michael Brown", time: "10:00 AM", status: "scheduled", bloodType: "B+" },
    { id: "4", name: "Emily Davis", time: "10:30 AM", status: "donating", bloodType: "AB+" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
        <p className="text-muted-foreground">Manage today's donation appointments</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 bg-secondary rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
          <CardDescription>Donors waiting or in process today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Donor</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Blood Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {queue.map((donor) => (
                  <tr key={donor.id} className="group">
                    <td className="py-4 font-medium">{donor.name}</td>
                    <td className="py-4 text-muted-foreground">{donor.time}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-bold text-xs">
                        {donor.bloodType}
                      </span>
                    </td>
                    <td className="py-4">
                      <StatusBadge status={donor.status} />
                    </td>
                    <td className="py-4 text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/hospital/process/${donor.id}`}>Process</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
