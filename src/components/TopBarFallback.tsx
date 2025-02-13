import { LogIn, Menu, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import cheerfulGenie from "../../public/cheerful-genie.png";

export function TopBarFallback() {
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
          <div className="hidden lg:block flex-1 mx-8">
            <form action="/search" method="GET" className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-primary/40" />
                </div>
                <input
                  type="text"
                  name="q"
                  placeholder="Search cocktails, ingredients, or flavors..."
                  className="block w-full pl-10 pr-10 py-2.5 bg-white border-2 border-primary/20 rounded-xl 
                           text-primary placeholder-primary/40 shadow-[0_2px_8px_rgba(74,111,165,0.06)]
                           focus:outline-hidden focus:border-secondary focus:ring-2 focus:ring-secondary/20 
                           transition-all duration-300"
                />
              </div>
            </form>
          </div>

          {/* Mobile Search Button */}
          <button
            className="lg:hidden p-2 text-primary/60 hover:text-primary transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Right Section */}
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

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-primary/60 hover:text-primary transition-colors"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Form - Initially Hidden */}
        <div className="hidden lg:hidden">
          <div className="py-4 px-4 border-t border-primary/10">
            <form action="/search" method="GET" className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-primary/40" />
                </div>
                <input
                  type="text"
                  name="q"
                  placeholder="Search cocktails, ingredients, or flavors..."
                  className="block w-full pl-10 pr-10 py-2.5 bg-white border-2 border-primary/20 rounded-xl 
                           text-primary placeholder-primary/40 shadow-[0_2px_8px_rgba(74,111,165,0.06)]
                           focus:outline-hidden focus:border-secondary focus:ring-2 focus:ring-secondary/20 
                           transition-all duration-300"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Menu - Initially Hidden */}
        <div className="hidden lg:hidden">
          <div className="py-4 border-t border-primary/10">
            <div className="space-y-1">
              {/* Mobile menu items would go here */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
