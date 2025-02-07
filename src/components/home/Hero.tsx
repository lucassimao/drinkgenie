import { ArrowRight, GlassWater, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { CocktailSlider } from "./CocktailSlider";
import { CountUp } from "./CountUp";

export function Hero() {
  const stats = [
    { value: 120, suffix: "+", label: "Recipes" },
    { value: 5, suffix: "+", label: "Users" },
    { value: 4.9, suffix: "/5", label: "Rating", decimals: 1 },
  ];

  return (
    <div className="relative overflow-visible">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-float" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-warning/20 rounded-full blur-[128px] animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[96px] animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <div className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 mb-8">
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-primary">
                  1000+ Free Cocktail Recipes
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-display text-primary mb-6 leading-tight">
                Craft Your Perfect
                <span className="block bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                  Cocktail Magic
                </span>
              </h1>

              <p className="text-xl text-primary/70 mb-8 max-w-xl">
                Discover endless possibilities with our AI-powered cocktail
                companion. From classic recipes to innovative creations, find
                your next favorite drink.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/recipes"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary/5 
                           text-primary rounded-xl font-medium transition-all duration-300 
                           hover:bg-primary/10 transform hover:scale-[1.02] group"
                >
                  <GlassWater className="mr-2 h-5 w-5" />
                  Browse Free Recipes
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/subscription"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r 
                           from-accent to-warning text-white rounded-xl font-medium group
                           transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                           relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div
                    className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full 
                               group-hover:translate-x-full transition-transform duration-1000"
                  />

                  {/* Content */}
                  <div className="relative flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    <span>Unlock Premium</span>
                  </div>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-left">
                    <div className="text-2xl font-bold text-accent mb-1">
                      <CountUp
                        end={stat.value}
                        suffix={stat.suffix}
                        decimals={stat.decimals}
                      />
                    </div>
                    <div className="text-sm text-primary/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Cocktail Slider */}
            <div className="lg:pl-12">
              <CocktailSlider />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
