"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { SearchBar } from "../SearchBar";
import { InfiniteScroll } from "./InfiniteScroll";

const FEATURED_COCKTAILS = [
  {
    name: "Classic Old Fashioned",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
    description: "A sophisticated blend of bourbon, bitters, and tradition",
    tags: ["Bourbon", "Classic", "Spirit-Forward"],
  },
  {
    name: "Spiced Negroni",
    image:
      "https://images.unsplash.com/photo-1551751299-1b51cab2694c?auto=format&fit=crop&w=1200&q=80",
    description: "A perfect balance of gin, vermouth, and Campari",
    tags: ["Gin", "Bitter", "Aperitif"],
  },
  {
    name: "Tropical Mai Tai",
    image:
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1200&q=80",
    description: "Transport yourself to paradise with this rum classic",
    tags: ["Rum", "Tropical", "Fruity"],
  },
];

export function CocktailSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % FEATURED_COCKTAILS.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [isTransitioning]);

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
          (prev - 1 + FEATURED_COCKTAILS.length) % FEATURED_COCKTAILS.length,
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl">
      {/* Slider Container - Keep overflow-hidden here for transitions */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        {FEATURED_COCKTAILS.map((cocktail, index) => (
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
            <img
              src={cocktail.image}
              alt={cocktail.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-display mb-2">{cocktail.name}</h3>
              <p className="text-white/80 mb-4">{cocktail.description}</p>
              <div className="flex flex-wrap gap-2">
                {cocktail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                  >
                    {tag}
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
          {FEATURED_COCKTAILS.map((_, index) => (
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
          <InfiniteScroll
            items={[
              "Mojito",
              "Margarita",
              "Old Fashioned",
              "Martini",
              "Negroni",
              "Daiquiri",
              "Moscow Mule",
              "Whiskey Sour",
              "Gin & Tonic",
              "Cosmopolitan",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
