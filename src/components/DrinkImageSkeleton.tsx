import React from "react";
import { GlassWater } from "lucide-react";

export function DrinkImageSkeleton() {
  return (
    <div className="relative h-96 bg-gradient-to-br from-primary/5 to-primary/10 animate-pulse rounded-t-2xl overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm mb-4">
          <GlassWater className="h-12 w-12 text-primary/30" />
        </div>
        <div className="text-primary/40 text-center px-8">
          <p className="text-lg font-medium mb-2">
            Crafting your magical cocktail...
          </p>
          <p className="text-sm">
            Our AI is carefully generating a beautiful image
          </p>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-float" />
          <div
            className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Shimmer effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"
        style={{ backgroundSize: "200% 100%" }}
      />
    </div>
  );
}
