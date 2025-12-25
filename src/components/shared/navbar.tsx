import Link from "next/link";
import { Heart } from "lucide-react";
import { UserNav } from "@/components/shared/user-nav";

export function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b glass sticky top-0 z-50">
      <Link className="flex items-center justify-center gap-2 group" href="/">
        <Heart className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
        <span className="text-2xl font-bold tracking-tighter">Vitals</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
          Features
        </Link>
        <Link className="text-sm font-medium hover:text-primary transition-colors" href="#about">
          About
        </Link>
        <UserNav />
      </nav>
    </header>
  );
}
