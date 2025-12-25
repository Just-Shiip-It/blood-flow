import { cn } from "@/lib/utils";
import { AppointmentStatus, DonationStatus } from "@/lib/constants";

type StatusType = AppointmentStatus | DonationStatus | string;

const statusConfig: Record<string, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  checked_in: { label: "Checked In", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  screening: { label: "Screening", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  donating: { label: "Donating", className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  missed: { label: "Missed", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  processing: { label: "Processing", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  pass: { label: "Eligible", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  fail: { label: "Ineligible", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  resolved: { label: "Resolved", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-slate-100 text-slate-600" };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
