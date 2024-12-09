"use client";
import { getUserCredits } from "@/lib/user";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import { Coins, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import cheerfulGenie from "../../public/cheerful-genie.png";
import { SearchBar } from "./SearchBar";

export function TopBar() {
  const { user } = useUser();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      getUserCredits(user.id).then(setCredits);
    }
  }, [user?.id]);

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:h-14 py-3 md:py-0 gap-4">
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary/20 rounded-full blur animate-pulse"></div>
                  <Image
                    alt="DrinkGenie logo"
                    src={cheerfulGenie}
                    className="h-8 w-8 text-secondary relative"
                  />
                </div>
                <span className="text-xl font-display text-primary">
                  DrinkGenie
                </span>
              </div>
              <button className="md:hidden p-2 text-primary/60 hover:text-primary">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </Link>

          {/* Search Bar - Full Width on Mobile */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <SearchBar />
          </div>

          {/* Navigation and Auth Buttons - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex space-x-6">
              <Link
                href="/credits"
                className="group flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white 
                bg-gradient-to-r from-accent to-warning rounded-xl transition-all duration-300 
                hover:shadow-lg transform hover:scale-[1.02]"
              >
                <Coins className="h-4 w-4" />
                <span>Get Credits</span>
                {typeof credits == "number" && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    ${credits}/credit{credits > 1 ? "s" : null}
                  </span>
                )}
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <SignedIn>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-primary">
                    Hi, {user?.firstName || user?.username}
                  </span>
                  <SignOutButton>
                    <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </SignedIn>
              <SignedOut>
                <button
                  className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark 
                           rounded-xl transition-all duration-300 transform hover:scale-[1.02] 
                           hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 
                           focus:ring-accent/30"
                >
                  <Link href="/sign-in">Sign In</Link>
                </button>
              </SignedOut>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Only visible on mobile */}
        <div className="md:hidden border-t border-primary/10 py-4 space-y-4">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/credits"
              className="flex items-center justify-between px-4 py-3 text-sm font-medium text-white 
                       bg-gradient-to-r from-accent to-warning rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                <span>Get Credits</span>
              </div>
              <span className="px-2 py-1 bg-white/20 rounded text-xs">
                $1/credit
              </span>
            </Link>
          </nav>
          <div className="flex flex-col gap-3 pt-4 border-t border-primary/10">
            <SignedIn>
              <div className="flex items-center justify-between px-4">
                <span className="text-sm text-primary">
                  Hi, {user?.firstName || user?.username}
                </span>
                <div className="px-2 py-1 bg-background rounded-lg text-sm">
                  <span className="font-medium text-accent">5</span>
                  <span className="text-primary/60 ml-1">credits</span>
                </div>
              </div>
              <SignOutButton>
                <button className="w-full px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="w-full px-5 py-2.5 text-sm font-medium text-white bg-accent 
                         hover:bg-accent-dark rounded-xl transition-all duration-300 
                         transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] 
                         focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}
