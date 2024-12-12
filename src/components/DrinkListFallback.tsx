import { GlassWater } from "lucide-react";

function DrinkCardPlaceHolder() {
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden h-full">
      <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 animate-pulse">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
            <GlassWater className="h-8 w-8 text-primary/30" />
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-float" />
          <div
            className="absolute -bottom-4 -left-4 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>

      <div className="p-6">
        {/* Title Skeleton */}
        <div className="h-6 bg-primary/10 rounded-lg animate-pulse mb-4 w-3/4" />

        {/* Ingredients Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 bg-warning/20 rounded-full animate-pulse"
              style={{ width: `${Math.random() * 30 + 60}px` }}
            />
          ))}
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 bg-primary/5 rounded-lg animate-pulse" />
          <div className="h-8 w-24 bg-primary/5 rounded-lg animate-pulse" />
        </div>

        {/* Creator Skeleton */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse" />
            <div className="h-4 w-24 bg-primary/10 rounded animate-pulse" />
          </div>
          <div className="h-4 w-16 bg-primary/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function DrinkListFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <DrinkCardPlaceHolder key={index} />
      ))}
    </div>
  );
}
