import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Droplets, Trophy } from "lucide-react";
import { getDonationHistory } from "@/actions/donor-actions"; // Assuming this exists or will be created
import { StatusBadge } from "@/components/shared/status-badge";
import { requireAuth } from "@/lib/auth-utils";
import { DonationWithCenter } from "@/types";

export default async function HistoryPage() {
  const user = await requireAuth();
  
  // Placeholder data until we have real donations
  // const { data: donations } = await getDonationHistory(user.id);
  const donations: DonationWithCenter[] = []; 

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Donation History</h1>
        <p className="text-muted-foreground">Track your life-saving journey.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Whole blood donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lives Impacted</CardTitle>
            <HeartIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Estimated impact</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Achievements unlocked</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Donations</h2>
        {donations && donations.length > 0 ? (
          donations.map((donation: DonationWithCenter) => (
             <Card key={donation.id}>
               {/* Donation details */}
             </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
                <History className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium">No donation history</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You haven't made any donations yet. Your journey is just beginning!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
