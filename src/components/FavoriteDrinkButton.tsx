"use client";

import { useToast } from "@/hooks/useToast";
import { toggleFavorite } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";

type FavoriteDrinkButtonProps = {
  drink: Drink;
};

export function FavoriteDrinkButton({ drink }: FavoriteDrinkButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isFavorite, setIsFavorite] = useState(drink.isFavorite);
  const toast = useToast();

  const triggerAction = async () => {
    try {
      setIsPending(true);
      // Optimistic UI update
      setIsFavorite((v) => !v);

      await toggleFavorite(drink.id);
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
    <button
      className={`p-1.5 rounded-full transition-all duration-300 flex-shrink-0 ml-2 ${
        isPending
          ? "bg-warning/20 text-warning cursor-wait"
          : isFavorite
            ? "bg-warning text-white hover:bg-warning/90"
            : "bg-warning/10 text-warning hover:bg-warning/20"
      }`}
      onClick={triggerAction}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Star className="h-4 w-4" />
      )}{" "}
    </button>
  );
}
