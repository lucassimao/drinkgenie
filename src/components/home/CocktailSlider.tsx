"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { SearchBar } from "../SearchBar";
import { InfiniteScroll } from "./InfiniteScroll";
import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import Image from "next/image";
import Link from "next/link";

export function CocktailSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [featuredCocktails, setFeaturedCocktails] = useState<Drink[]>([]);

  useEffect(() => {
    getDrinks({ sortBy: "latest", pageSize: 5, page: 1 }).then(
      setFeaturedCocktails,
    );
  }, []);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % featuredCocktails.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [isTransitioning, featuredCocktails]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, nextSlide]);

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(
        (prev) =>
          (prev - 1 + featuredCocktails.length) % featuredCocktails.length,
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl">
      {/* Slider Container - Keep overflow-hidden here for transitions */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        {featuredCocktails.map((cocktail, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentIndex
                ? "translate-x-0"
                : index < currentIndex
                  ? "-translate-x-full"
                  : "translate-x-full"
            }`}
          >
            <Image
              src={cocktail.imageUrl!}
              alt={cocktail.name}
              height={cocktail.height}
              width={cocktail.width}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-display mb-2">{cocktail.name}</h3>
              <p className="text-white/80 mb-4">
                {cocktail.description.slice(0, 50) + " ..."}
              </p>
              <div className="flex flex-wrap gap-2">
                {cocktail.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                  >
                    <Link
                      href={`/search?query=${encodeURIComponent(ingredient)}`}
                    >
                      {ingredient}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 
                   backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 
                   backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {featuredCocktails.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-white"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Search Section - Separate from slider overflow */}
      <div className="p-8 border-t border-primary/10">
        <h2 className="text-2xl font-display text-primary mb-6">
          Find Your Next Drink
        </h2>
        <Suspense>
          <SearchBar />
        </Suspense>
        <div className="mt-6">
          <InfiniteScroll />
        </div>
      </div>
    </div>
  );
}
