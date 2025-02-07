import { BookOpen, Search, Star } from "lucide-react";
import Image from "next/image";
import cheerfulGenie from "../../public/cheerful-genie.png";
import Link from "next/link";

export function TopBarFallback() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="relative z-50">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur" />
                <Image
                  alt="DrinkGenie logo"
                  src={cheerfulGenie}
                  className="h-8 w-8 text-secondary relative"
                />{" "}
              </div>
              <span className="text-2xl font-display text-primary">
                DrinkGenie
              </span>
            </div>

            {/* Center Section with Search and Quick Links */}
            <div className="flex-1 flex items-center justify-center gap-8 px-8">
              {/* Quick Links */}
              <div className="hidden lg:flex items-center gap-6">
                <a
                  href="/recipes"
                  className="flex items-center gap-2 text-primary/70"
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm font-medium">Recipe Book</span>
                </a>
              </div>

              {/* Static Search Input */}
              <div className="flex-1 max-w-xl">
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
                               text-primary placeholder-primary/40 shadow-[0_2px_8px_rgba(74,111,165,0.06)]"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right Section */}
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
          </div>
        </div>
      </nav>
    </header>
  );
}
