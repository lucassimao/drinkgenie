import React from "react";
import { Drink as Cocktail } from "@/lib/drinks";
import { Loader2 } from "lucide-react";
import { DrinkCard } from "./DrinkCard";

interface CocktailListProps {
  cocktails: Cocktail[];
  currentPage: number;
  itemsPerPage: number;
}

export function CocktailList({
  cocktails,
  currentPage,
  itemsPerPage,
}: CocktailListProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCocktails = cocktails; //.slice(startIndex, endIndex);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {currentCocktails.map((cocktail) => (
        <div key={cocktail.id} className="relative">
          {cocktail.isGeneratingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl z-10">
              <Loader2 className="h-8 w-8 text-secondary animate-spin" />
            </div>
          )}
          <DrinkCard cocktail={cocktail} />
        </div>
      ))}
    </div>
  );
}
