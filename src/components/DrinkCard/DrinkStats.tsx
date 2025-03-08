import React from "react";
import { Clock, BarChart2, Droplet, Flame } from "lucide-react";
import { Drink } from "@/types/drink";
import Link from "next/link";

interface CocktailStatsProps {
  drink: Drink;
}

export function CocktailStats({ drink }: CocktailStatsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "hard":
        return "text-red-600 bg-red-50 border-red-100";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-100";
      default:
        return "text-green-600 bg-green-50 border-green-100";
    }
  };

  return (
    <Link href={`/drink/${encodeURIComponent(drink.slug)}`} passHref>
      <div className="flex flex-wrap gap-1.5">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs 
                    border touch-manipulation active:opacity-80 transition-opacity
                    ${getDifficultyColor(drink.difficulty)}`}
        >
          <BarChart2 className="h-3.5 w-3.5" />
          <span>{drink.difficulty}</span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs 
                    bg-primary/5 text-primary border border-primary/10
                    touch-manipulation active:opacity-80 transition-opacity"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>{drink.preparationTime}</span>
        </div>
        {drink.alcoholContent && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs 
                      bg-accent/5 text-accent border border-accent/10
                      touch-manipulation active:opacity-80 transition-opacity"
          >
            <Droplet className="h-3.5 w-3.5" />
            <span>{drink.alcoholContent} ABV</span>
          </div>
        )}
        {drink.calories && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs 
                      bg-warning/5 text-warning border border-warning/10
                      touch-manipulation active:opacity-80 transition-opacity"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>{drink.calories} cal</span>
          </div>
        )}
      </div>
    </Link>
  );
}
