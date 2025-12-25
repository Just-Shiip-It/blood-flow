import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAuth } from "@/lib/auth-utils";

export default async function SettingsPage() {
  const user = await requireAuth();

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your contact information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" defaultValue={user.email} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user.name} />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose how you want to be contacted.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 opacity-50 pointer-events-none">
          {/* Placeholder for notification settings */}
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 rounded border border-primary bg-primary" />
            <Label>Email Notifications</Label>
          </div>
          <p className="text-xs text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
