"use client";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import cheerfulGenie from "../../public/cheerful-genie.png";
import { SearchBar } from "./SearchBar";

import { countUserFavorites } from "@/lib/user";
import {
  Bell,
  BookOpen,
  ChevronDown,
  Crown,
  Heart,
  LogOut,
  Star,
} from "lucide-react";
import { useRef, useState } from "react";

export function TopBar() {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [favortiesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      countUserFavorites(user.id).then(setFavoritesCount);
    }
  }, [user]);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="relative z-50">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
              href="/"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur animate-pulse" />
                <Image
                  alt="DrinkGenie logo"
                  src={cheerfulGenie}
                  className="h-8 w-8 text-secondary relative"
                />
              </div>
              <span className="text-2xl font-display text-primary">
                DrinkGenie
              </span>
            </Link>

            {/* Center Section with Search and Quick Links */}
            <div className="flex-1 flex items-center justify-center gap-8 px-8">
              {/* Quick Links */}
              <div className="hidden lg:flex items-center gap-6">
                <Link
                  href="/search"
                  className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm font-medium">Recipe Book</span>
                </Link>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-xl">
                <Suspense>
                  <SearchBar />
                </Suspense>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Action Icons */}
              <SignedIn>
                <div className="hidden md:flex items-center gap-4">
                  {/* Favorites Button with Tooltip */}
                  <Link
                    href={"/favorites"}
                    className="group relative p-2 text-primary/60 hover:text-primary transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                      {favortiesCount}
                    </span>
                    {/* Tooltip */}
                    <div
                      className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-primary/90 
                                text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 whitespace-nowrap pointer-events-none"
                    >
                      Favorite Recipes
                    </div>
                  </Link>

                  {/* Notifications Button with Tooltip */}
                  <button className="group relative p-2 text-primary/60 hover:text-primary transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-white text-xs rounded-full flex items-center justify-center">
                      0
                    </span>
                    {/* Tooltip */}
                    <div
                      className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-primary/90 
                                text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 whitespace-nowrap pointer-events-none"
                    >
                      Notifications
                    </div>
                  </button>
                </div>
              </SignedIn>

              {/* Auth Section */}
              <SignedIn>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 group"
                  >
                    <img
                      src={user?.imageUrl}
                      alt={user?.fullName || "User"}
                      className="h-10 w-10 rounded-full border-2 border-accent/20 group-hover:border-accent transition-colors"
                    />
                    <div className="hidden md:block">
                      <div className="font-medium text-primary group-hover:text-accent transition-colors">
                        {user?.firstName || user?.username}
                      </div>
                      <div className="text-xs text-primary/60">
                        Premium Member
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-primary/60 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
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
                          {user?.fullName}
                        </div>
                        <div className="text-sm text-primary/60">
                          {user?.primaryEmailAddress?.emailAddress}
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
              </SignedIn>
              <SignedOut>
                <div className="flex items-center gap-4">
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-primary/70 hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/subscription"
                    className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                             from-warning to-accent rounded-xl font-medium text-white shadow-lg
                             hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]
                             overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full 
                                 group-hover:-translate-x-full transition-transform duration-700"
                    />
                    <div className="relative flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      <span>Upgrade to Premium</span>
                    </div>
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
