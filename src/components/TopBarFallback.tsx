import Image from "next/image";
import Link from "next/link";
import cheerfulGenie from "../../public/cheerful-genie.png";
import { SearchBar } from "./SearchBar";

export function TopBarFallback() {
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
              <div className="md:hidden p-2 text-primary/60 hover:text-primary"></div>
            </div>
          </Link>

          {/* Search Bar - Full Width on Mobile */}
          <div className="flex-1 max-w-2xl mx-auto w-full">
            <SearchBar />
          </div>

          {/* Navigation and Auth Buttons - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-6">
            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-dark 
                           rounded-xl transition-all duration-300 transform hover:scale-[1.02] 
                           hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 
                           focus:ring-accent/30"
              >
                <Link href="/sign-in">Sign In</Link>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Only visible on mobile */}
        <div className="md:hidden border-t border-primary/10 py-4 space-y-4">
          <div className="flex flex-col gap-3">
            <Link
              href="/sign-in"
              className="w-full px-5 py-2.5 text-sm font-medium text-white bg-accent 
                         hover:bg-accent-dark rounded-xl transition-all duration-300 
                         transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] 
                         focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}