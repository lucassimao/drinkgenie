"use client";

import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Bell,
  Crown,
  Heart,
  LogIn,
  LogOut,
  Search as SearchIcon,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

export function TopBar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white shadow-sm relative z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="h-16 md:h-20 flex items-center justify-between gap-4">
          <Logo />

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2 text-primary/60 hover:text-primary transition-colors mr-1"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            {/* Action Icons - Desktop */}
            {isSignedIn && (
              <div className="hidden md:flex items-center gap-4">
                <button className="group relative p-2 text-primary/60 hover:text-primary transition-colors">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                <button className="group relative p-2 text-primary/60 hover:text-primary transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </button>
              </div>
            )}

            {/* Auth Section */}
            {!isSignedIn && (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Sign In only for large screens */}

                <Link
                  href="/subscription"
                  className="group relative inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 
                           bg-gradient-to-r from-warning to-accent rounded-xl font-medium text-white 
                           shadow-lg hover:shadow-xl transition-all duration-300 transform 
                           hover:scale-[1.02] overflow-hidden hidden sm:inline-flex"
                >
                  <Star className="h-4 w-4 md:h-5 sm:w-5" />
                  <span className="hidden lg:inline">Upgrade to Premium</span>
                  <span className="lg:hidden">Upgrade</span>
                </Link>
              </div>
            )}

            <div>
              {isSignedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 group h-8 w-8 md:h-10 md:w-10"
                  >
                    <Image
                      src={user!.imageUrl}
                      alt={user!.fullName || "User"}
                      fill
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-accent/20 group-hover:border-accent transition-colors"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-primary/10 
                        py-2 animate-in fade-in slide-in-from-top-2"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-primary/10">
                        <div className="font-medium text-primary">
                          {user!.fullName}
                        </div>
                        <div className="text-sm text-primary/60">
                          {user!.primaryEmailAddress?.emailAddress}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 px-4 py-2 text-primary/80 hover:text-primary 
                           hover:bg-primary/5 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          <span>Favorite Recipes</span>
                          <span className="ml-auto bg-warning text-white text-xs px-2 py-1 rounded-full">
                            2
                          </span>
                        </Link>
                        <Link
                          href="/subscription"
                          className="flex items-center gap-3 px-4 py-2 text-primary/80 hover:text-primary 
                           hover:bg-primary/5 transition-colors"
                        >
                          <Bell className="h-4 w-4" />
                          <span>Notifications</span>
                          <span className="ml-auto bg-warning text-white text-xs px-2 py-1 rounded-full">
                            2
                          </span>
                        </Link>
                        <Link
                          href="/subscription"
                          className="flex items-center gap-3 px-4 py-2 text-primary/80 hover:text-primary 
                           hover:bg-primary/5 transition-colors"
                        >
                          <Crown className="h-4 w-4" />
                          <span>Subscription</span>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-primary/10 pt-2 mt-2">
                        <SignOutButton>
                          <button
                            className="w-full flex items-center gap-3 px-4 py-2 text-primary/80 
                               hover:text-primary hover:bg-primary/5 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </SignOutButton>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-3 px-4 py-3 text-primary/80 hover:text-primary 
                     hover:bg-primary/5 rounded-lg transition-colors"
                  aria-label="Sign in"
                >
                  <LogIn className="h-5 w-5 hidden sm:inline" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div
            ref={searchRef}
            className="absolute inset-x-0 top-full bg-white shadow-lg border-t border-primary/10 p-4 lg:hidden z-10"
          >
            <SearchBar />
          </div>
        )}
      </nav>
    </header>
  );
}
