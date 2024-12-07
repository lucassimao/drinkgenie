import React from "react";
import { Drink as Cocktail } from "@/types/drink";
import { Loader2 } from "lucide-react";
import { DrinkCard } from "./DrinkCard";

interface DrinkListProps {
  cocktails: Cocktail[];
  searchParams: string;
}

export function DrinkList({ cocktails, searchParams }: DrinkListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cocktails.map((drink) => (
        <div key={drink.id} className="relative">
          {drink.isGeneratingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl z-10">
              <Loader2 className="h-8 w-8 text-secondary animate-spin" />
            </div>
          )}
          <DrinkCard searchParams={searchParams} drink={drink} />
        </div>
      ))}
    </div>
  );
}
