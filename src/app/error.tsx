"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 p-4 bg-destructive/10 rounded-full animate-pulse">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try again
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
