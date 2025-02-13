"use client";

import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Bell,
  ChevronDown,
  Crown,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search as SearchIcon,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import cheerfulGenie from "../../public/cheerful-genie.png";
import { SearchBar } from "./SearchBar";
import { usePathname } from "next/navigation";

export function TopBar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white shadow-xs relative z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            className="shrink-0 flex items-center gap-3 cursor-pointer"
            href="/"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-sm animate-pulse" />
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

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 mx-8">
            <SearchBar />
          </div>

          {/* Mobile Search Toggle */}
          <button
            className="lg:hidden p-2 text-primary/60 hover:text-primary transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          {/* Right Section */}
          <div className="flex items-center gap-4">
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
            {isSignedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 group"
                >
                  <Image
                    src={user!.imageUrl}
                    alt={user!.fullName || "User"}
                    fill
                    className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-accent/20 group-hover:border-accent transition-colors"
                  />
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
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Sign In - Icon for mobile, text for larger screens */}
                <Link
                  href="/sign-in"
                  className="p-2 text-primary/70 hover:text-primary transition-colors sm:hidden"
                  aria-label="Sign in"
                >
                  <LogIn className="h-5 w-5" />
                </Link>
                <Link
                  href="/sign-in"
                  className="hidden sm:block text-sm font-medium text-primary/70 hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/subscription"
                  className="group relative inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 
                           bg-linear-to-r from-warning to-accent rounded-xl font-medium text-white 
                           shadow-lg hover:shadow-xl transition-all duration-300 transform 
                           hover:scale-[1.02] overflow-hidden"
                >
                  <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Upgrade to Premium</span>
                  <span className="sm:hidden">Upgrade</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-primary/60 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div
            ref={searchRef}
            className="absolute inset-x-0 top-full bg-white shadow-lg border-t border-primary/10 p-4 lg:hidden"
          >
            <SearchBar />
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="py-4 border-t border-primary/10">
              <div className="space-y-1">
                {isSignedIn && (
                  <>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-3 px-4 py-3 text-primary/80 hover:text-primary 
                               hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Favorites</span>
                      <span className="ml-auto bg-accent text-white text-xs px-2 py-1 rounded-full">
                        3
                      </span>
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center gap-3 px-4 py-3 text-primary/80 hover:text-primary 
                               hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Bell className="h-5 w-5" />
                      <span>Notifications</span>
                      <span className="ml-auto bg-warning text-white text-xs px-2 py-1 rounded-full">
                        2
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
