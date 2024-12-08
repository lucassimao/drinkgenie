"use client";

import { useToast } from "@/hooks/useToast";
import { generateDrink } from "@/lib/drinks";
import { MAX_INGREDIENTS } from "@/lib/utils";
import { ServiceError } from "@/types/drink";
import { useUser } from "@clerk/nextjs";
import { Martini, Plus, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoadingState } from "./LoadingState";

const SUGGESTED_INGREDIENTS = [
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Lime Juice",
  "Simple Syrup",
  "Orange Juice",
  "Cranberry Juice",
];

export function IngredientForm() {
  const router = useRouter();
  const { user } = useUser();
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const suggestionsDropdownRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // closes the ingredient dropdown if you click outide of it or hit ESC key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsDropdownRef.current &&
        !suggestionsDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveInput(null);
      }
    }

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveInput(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const onClickGenerate = async () => {
    if (!user) {
      toast.warning("Sign up to unlock a world of cocktail creativity!");
      return;
    }

    const filteredIngredients = ingredients.filter((ing) => ing.trim() !== "");

    if (
      filteredIngredients.length == 0 ||
      filteredIngredients.length > MAX_INGREDIENTS
    ) {
      toast.error(
        `Add up to ${MAX_INGREDIENTS} ingredients, and we'll shake things up for you.`,
        "Not enough to work with!",
      );
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateDrink(filteredIngredients);
      // setIngredients([""]);
      // setActiveInput(null);
      router.push(`/drink/${result.slug}`);
    } catch (error) {
      const errorMessage =
        error instanceof ServiceError ? error.message : "Something went wrong!";
      toast.error(errorMessage, "Ooops...");
    } finally {
      // setIsGenerating(false);
    }
  };

  const handleAddIngredient = () => {
    if (ingredients.length < 4) {
      setIngredients([...ingredients, ""]);
      setActiveInput(ingredients.length);
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
    setActiveInput(null);
  };

  const addSuggestedIngredient = (ingredient: string) => {
    if (activeInput !== null && activeInput < ingredients.length) {
      const newIngredients = [...ingredients];
      newIngredients[activeInput] = ingredient;
      setIngredients(newIngredients);
      setActiveInput(null);
    }
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-4xl mx-auto"
      ref={suggestionsDropdownRef}
    >
      {isGenerating && <LoadingState />}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-accent/10 rounded-full">
          <Martini className="h-10 w-10 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-display text-primary">
            Your Ingredients
          </h2>
          <p className="mt-3 text-primary/60">
            Add up to 4 ingredients you have
          </p>
        </div>
      </div>
      <div className="space-y-8">
        <div className="grid gap-5">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="relative">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => {
                  const newIngredients = [...ingredients];
                  newIngredients[index] = e.target.value;
                  setIngredients(newIngredients);
                }}
                onFocus={() => setActiveInput(index)}
                className="w-full px-5 py-4 bg-background border-2 border-primary/10 rounded-xl
                         text-primary placeholder-primary/40 focus:outline-none focus:border-secondary
                         focus:ring-2 focus:ring-secondary/20 transition-all duration-300"
                placeholder={`Ingredient ${index + 1}`}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                           text-primary/40 hover:text-primary/60 hover:bg-primary/5 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              {/* Suggestions Dropdown */}
              {activeInput === index && (
                <div
                  className="absolute z-10 left-0 right-0 mt-2 py-3 bg-white rounded-xl shadow-lg
                              border border-primary/10"
                  ref={suggestionsDropdownRef}
                >
                  <div className="px-4 pb-2 mb-2 border-b border-primary/5">
                    <p className="text-sm text-primary/60">
                      Suggested Ingredients
                    </p>
                  </div>
                  <div className="max-h-48 overflow-y-auto px-2">
                    {SUGGESTED_INGREDIENTS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => addSuggestedIngredient(suggestion)}
                        className="w-full px-4 py-2.5 text-left text-primary hover:bg-background
                                 transition-colors flex items-center gap-2 rounded-lg"
                      >
                        <span className="w-2 h-2 rounded-full bg-accent/60" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          {ingredients.length < MAX_INGREDIENTS && (
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center justify-center gap-2 px-6 py-4 text-primary
                       border-2 border-primary/20 rounded-xl hover:bg-primary/5
                       transition-colors flex-1 sm:flex-none"
            >
              <Plus className="h-5 w-5" />
              Add Another Ingredient
            </button>
          )}
          <button
            onClick={onClickGenerate}
            disabled={isGenerating || ingredients.every((ing) => !ing.trim())}
            className="flex-1 sm:flex-none relative overflow-hidden px-8 py-4 bg-gradient-to-r 
                     from-accent to-warning text-white rounded-xl font-medium group
                     transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                     active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-accent/30
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-lg">Get Magical Suggestions</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
