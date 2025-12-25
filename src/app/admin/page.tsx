import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Droplets, HelpCircle, TrendingUp, TrendingDown } from "lucide-react";

export default function AdminDashboard() {
  // Mock data - will be replaced with server actions
  const stats = [
    { name: "Total Donors", value: "10,482", change: "+12%", trend: "up", icon: Users },
    { name: "Active Centers", value: "52", change: "+3", trend: "up", icon: Building2 },
    { name: "Donations This Month", value: "1,847", change: "-5%", trend: "down", icon: Droplets },
    { name: "Pending Queries", value: "8", change: "0", trend: "neutral", icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-slate-400">System-wide statistics and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon className="h-8 w-8 text-primary" />
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-green-400" : stat.trend === "down" ? "text-red-400" : "text-slate-400"
                }`}>
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                  {stat.trend === "down" && <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New center added", detail: "City Hospital Blood Bank", time: "2 hours ago" },
                { action: "User verified", detail: "Dr. Sarah Johnson", time: "4 hours ago" },
                { action: "Query resolved", detail: "Donation certificate issue", time: "6 hours ago" },
                { action: "Center deactivated", detail: "Mobile Camp #12", time: "1 day ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <div>
                    <div className="font-medium text-sm">{item.action}</div>
                    <div className="text-xs text-slate-400">{item.detail}</div>
                  </div>
                  <div className="text-xs text-slate-500">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Add Center", href: "/admin/centers/new" },
                { label: "View Users", href: "/admin/users" },
                { label: "Pending Queries", href: "/admin/queries" },
                { label: "Generate Report", href: "/admin/reports" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="p-4 bg-slate-800 rounded-lg text-center hover:bg-slate-700 transition-colors"
                >
                  <div className="text-sm font-medium">{action.label}</div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
