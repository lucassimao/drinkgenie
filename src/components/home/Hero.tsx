import React, { Suspense } from "react";
import { GlassWater, ArrowRight } from "lucide-react";
import { Stats } from "./Stats";
import { CocktailSlider } from "./CocktailSlider";
import Link from "next/link";
import { PremiumActionButton } from "./PremiumActionButton";

export function Hero() {
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
      <div className="relative min-h-[85vh]">
        <div className="max-w-7xl mx-auto px-4 py-12 w-full h-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left flex flex-col justify-between space-y-12">
              {/* Top Content */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl font-display text-primary leading-[1.3]">
                  <span className="block">Craft Your</span>
                  <span
                    className="block mt-4 bg-linear-to-r from-accent to-warning 
                                 bg-clip-text text-transparent leading-[1.4] pb-0"
                  >
                    Perfect
                  </span>
                  <span
                    className="block bg-linear-to-r from-accent to-warning 
                                 bg-clip-text text-transparent leading-[1.4] pb-3"
                  >
                    Cocktail Magic
                  </span>
                </h1>

                <p className="text-lg text-primary/70 max-w-xl leading-relaxed">
                  Discover endless possibilities with our AI-powered cocktail
                  companion. From classic recipes to innovative creations, find
                  your next favorite drink.
                </p>
              </div>

              {/* Middle Content - Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary/5 
                           text-primary rounded-xl font-medium transition-all duration-300 
                           hover:bg-primary/10 transform hover:scale-[1.02] group"
                >
                  <GlassWater className="mr-2 h-5 w-5" />
                  Browse Free Recipes
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <Suspense fallback={<div className="h-12 w-full max-w-[200px] bg-accent/10 animate-pulse rounded-xl"></div>}>
                  <PremiumActionButton />
                </Suspense>
              </div>

              {/* Bottom Content - Stats */}
              <div>
                <Stats />
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