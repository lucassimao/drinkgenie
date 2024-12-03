"use client";

import React from "react";
import { Star, Clock, BarChart2 } from "lucide-react";
import { Drink as Cocktail } from "@/lib/drinks";
import { getRelativeTimeString } from "@/lib/dateUtils";
import { useRouter } from "next/navigation";

type DrinkCardProps = {
  cocktail: Cocktail;
};

const getDifficultyColor = (difficulty: string = "Easy") => {
  switch (difficulty.toLowerCase()) {
    case "hard":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-amber-600 bg-amber-50";
    default:
      return "text-green-600 bg-green-50";
  }
};

export function DrinkCard({ cocktail }: DrinkCardProps) {
  const router = useRouter();

  return (
    <div
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
                 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
                 flex flex-col h-full"
      onClick={() => router.push(`/drinks/${cocktail.slug}`)}
    >
      <div className="aspect-w-16 aspect-h-9 relative h-48 flex-shrink-0">
        {cocktail.imageUrl ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={cocktail.imageUrl}
              alt={cocktail.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <p className="text-primary/50 font-display">Image unavailable</p>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-display text-primary group-hover:text-secondary transition-colors line-clamp-2">
            {cocktail.name}
          </h3>
          <button
            className="p-1.5 rounded-full bg-warning/10 text-warning hover:bg-warning/20 transition-colors flex-shrink-0 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              // Handle favoriting
            }}
          >
            <Star className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {cocktail.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm bg-warning/20 text-primary rounded-full line-clamp-1"
                >
                  {ingredient}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${getDifficultyColor(cocktail.difficulty)}`}
              >
                <BarChart2 className="h-4 w-4" />
                <span>{cocktail.difficulty || "Easy"}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-primary/5 text-primary">
                <Clock className="h-4 w-4" />
                <span>{cocktail.preparationTime || "5 mins"}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-primary/10">
            <div className="flex items-center justify-between text-sm text-primary/60">
              <span>{getRelativeTimeString(cocktail.createdAt)}</span>
              {cocktail.creator && (
                <div className="flex items-center gap-2">
                  <img
                    src={cocktail.creator.avatarUrl}
                    alt={cocktail.creator.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="line-clamp-1">{cocktail.creator.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
