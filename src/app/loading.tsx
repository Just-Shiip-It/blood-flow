import { Heart } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="relative">
        <Heart className="h-16 w-16 text-primary animate-pulse" />
        <div className="absolute inset-0 h-16 w-16 text-primary animate-ping opacity-25">
          <Heart className="h-full w-full" />
        </div>
      </div>
      <p className="mt-8 text-lg font-medium tracking-tight animate-bounce">
        Vitals
      </p>
    </div>
  );
}
