import React from "react";
import { Loader2, Search } from "lucide-react";

export function SearchLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-white p-4 rounded-full">
          <div className="animate-spin">
            <Search className="h-8 w-8 text-accent" />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-display text-primary mb-2">
        Searching for your perfect drink...
      </h3>
      <p className="text-primary/60 text-center max-w-md mb-8">
        Our magical mixologist is carefully reviewing recipes and ingredients
      </p>

      {/* Loading Progress */}
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 text-sm text-primary/60 mb-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Analyzing ingredients...</span>
        </div>
        <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-warning rounded-full w-2/3 animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>

      {/* Placeholder Results */}
      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-48 bg-primary/5 rounded-lg mb-4" />
            <div className="h-4 bg-primary/5 rounded w-3/4 mb-2" />
            <div className="h-4 bg-primary/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
