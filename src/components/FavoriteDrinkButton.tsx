"use client";

import { useToast } from "@/hooks/useToast";
import { toggleFavorite } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";

type FavoriteDrinkButtonProps = {
  drink: Drink;
};

export function FavoriteDrinkButton({ drink }: FavoriteDrinkButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isFavorite, setIsFavorite] = useState(drink.isFavorite);
  const toast = useToast();

  const triggerAction = async () => {
    setIsPending(true);
    // Optimistic UI update
    setIsFavorite((v) => !v);

    try {
      const result = await toggleFavorite(drink.id);
      if (typeof result == "string") throw new Error(result);
    } catch (error) {
      // Roll back the optimistic update
      setIsFavorite((v) => !v);

      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Could not favorite your drink now.";
      toast.error(message, "Ooops");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="group/tooltip">
      <button
        onClick={triggerAction}
        className={`group relative p-4 md:p-3 rounded-xl mt-0 transition-all duration-300 touch-manipulation
                ${
                  isPending
                    ? "bg-white/20 backdrop-blur-sm cursor-wait"
                    : isFavorite
                      ? "bg-warning text-white hover:bg-warning/90 active:bg-warning/80"
                      : "bg-white/20 backdrop-blur-sm hover:bg-white/30 active:bg-white/40"
                }`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {/* Background blur effect */}
        <div className="absolute inset-0 rounded-xl backdrop-blur-[2px] opacity-50" />

        {/* Button content */}
        <div className="relative">
          {isPending ? (
            <Loader2 className="h-6 w-6 md:h-5 md:w-5 animate-spin text-white" />
          ) : (
            <Heart
              className={`h-6 w-6 md:h-5 md:w-5 transition-all duration-300 ${
                isFavorite
                  ? "fill-current scale-110"
                  : "text-white group-hover:scale-110"
              }`}
            />
          )}
        </div>
      </button>

      {/* Tooltip */}
      <div
        className="fixed invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 
                 transition-opacity duration-200 pointer-events-none"
      >
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-2">
          <div
            className="bg-primary/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap 
                     shadow-lg backdrop-blur-sm"
          >
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </div>
        </div>
      </div>
    </div>
  );
}
