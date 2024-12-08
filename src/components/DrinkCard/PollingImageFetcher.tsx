"use client";

import { useDrinkImagePoller } from "@/hooks/useDrinkImagePoller";
import { Drink } from "@/types/drink";
import { GlassWater } from "lucide-react";
import { DrinkImage } from "./DrinkImage";

type PollingImageFetcherProps = {
  drink: Drink;
  ot;
};
export const PollingImageFetcher = ({ drink }: PollingImageFetcherProps) => {
  const { updatedDrink } = useDrinkImagePoller(drink.id);

  if (updatedDrink) {
    return <DrinkImage drink={updatedDrink} />;
  }

  return (
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
  );
};
