"use client";

import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { SearchBar } from "../SearchBar";
import { InfiniteScroll } from "./InfiniteScroll";

export function CocktailSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredCocktails, setFeaturedCocktails] = useState<Drink[]>([]);
  const autoplayRef = useRef<NodeJS.Timeout>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeaturedCocktails();
  }, []);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  useEffect(() => {
    if (featuredCocktails.length > 0) {
      startAutoplay();
    }
    return () => stopAutoplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, featuredCocktails]);

  const fetchFeaturedCocktails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const drinks = await getDrinks({
        page: 1,
        pageSize: 3,
        sortBy: "rating",
      });
      setFeaturedCocktails(drinks);
    } catch (err) {
      console.error("Error fetching featured cocktails:", err);
      setError("Unable to load featured cocktails. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  const nextSlide = () => {
    if (!isTransitioning && featuredCocktails.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % featuredCocktails.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning && featuredCocktails.length > 0) {
      setIsTransitioning(true);
      setCurrentIndex(
        (prev) =>
          (prev - 1 + featuredCocktails.length) % featuredCocktails.length,
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    stopAutoplay();
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    startAutoplay();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-auto max-w-[90vw] lg:max-w-none">
        {/* Match the aspect ratio of the main slider */}
        <div className="relative aspect-[4/3]">
          {/* Gradient background animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 animate-pulse">
            {/* Decorative background elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-float" />
            <div
              className="absolute -bottom-4 -left-4 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-float"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {/* Centered content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
              <div className="relative p-4 bg-white/10 backdrop-blur-sm rounded-full">
                <Loader2 className="h-8 w-8 text-accent animate-spin" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-primary mb-2">
              Loading Featured Cocktails
            </h3>
            <p className="text-primary/60 text-center">
              Preparing your magical drink selections...
            </p>
          </div>
        </div>

        {/* Add a placeholder for the bottom section to maintain layout */}
        <div className="p-4 sm:p-6 md:p-8 border-t border-primary/10">
          <div className="h-[100px] bg-primary/5 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-auto max-w-[90vw] lg:max-w-none">
        <div className="relative aspect-[4/3] bg-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <AlertCircle className="h-8 w-8 text-warning mx-auto mb-4" />
              <p className="text-primary/60 mb-4">{error}</p>
              <button
                onClick={fetchFeaturedCocktails}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredCocktails.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-xl mx-auto max-w-[90vw] lg:max-w-none">
      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="relative aspect-[4/3] overflow-hidden rounded-t-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fixed Content Layer */}
        <div className="absolute inset-0 z-10">
          {/* Title, description, and tags at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl md:text-2xl font-display mb-2 text-white">
                {featuredCocktails[currentIndex]?.name}
              </h3>
              <p className="text-sm sm:text-base text-white/80 mb-3 sm:mb-4 line-clamp-1 max-w-lg">
                {featuredCocktails[currentIndex]?.description}
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {featuredCocktails[currentIndex]?.ingredients
                  .slice(0, 3)
                  .map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full 
                             text-xs sm:text-sm text-white whitespace-nowrap"
                    >
                      <Link
                        href={`/search?query=${encodeURIComponent(ingredient)}`}
                      >
                        {ingredient}
                      </Link>
                    </span>
                  ))}
              </div>

              {/* Dots Indicator - Now below tags */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-4">
                {featuredCocktails.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => {
                      stopAutoplay();
                      setCurrentIndex(dotIndex);
                    }}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                      dotIndex === currentIndex
                        ? "w-4 sm:w-6 bg-white"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                    aria-current={dotIndex === currentIndex}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sliding Image Layer */}
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
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={cocktail.imageUrl!}
              alt={cocktail.name}
              fill
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="hidden md:block">
          <button
            onClick={() => {
              stopAutoplay();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 
                     backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              stopAutoplay();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 
                     backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Popular Terms Section */}
      <div className="p-4 sm:p-6 md:p-8 border-t border-primary/10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-display text-primary mb-3 sm:mb-4 md:mb-6">
          Popular Cocktails
        </h2>
        <Suspense>
          <SearchBar></SearchBar>
        </Suspense>
        <div className="mt-8">
          <InfiniteScroll />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative bg-white rounded-2xl shadow-xl mx-auto max-w-[90vw] lg:max-w-none">
      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="relative aspect-[4/3] overflow-hidden rounded-t-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
            aria-hidden={index !== currentIndex}
          >
            <div className="relative h-full">
              <Image
                src={cocktail.imageUrl!}
                alt={cocktail.name}
                fill
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-display mb-2 text-white">
                  {cocktail.name}
                </h3>
                <p className="text-sm sm:text-base text-white/80 mb-3 sm:mb-4 line-clamp-1 max-w-lg">
                  {cocktail.description}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {cocktail.ingredients.slice(0, 3).map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full 
                               text-xs sm:text-sm text-white whitespace-nowrap"
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
          </div>
        ))}

        {/* Navigation Arrows */}
        <div className="hidden md:block">
          <button
            onClick={() => {
              stopAutoplay();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 
                     backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              stopAutoplay();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 
                     backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-24 sm:bottom-20 md:bottom-24 left-0 right-0 flex justify-center gap-1.5 sm:gap-2">
          {featuredCocktails.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                stopAutoplay();
                setCurrentIndex(index);
              }}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-4 sm:w-6 bg-white"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      </div>

      {/* Popular Terms Section */}
      <div className="p-4 sm:p-6 md:p-8 border-t border-primary/10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-display text-primary mb-3 sm:mb-4 md:mb-6">
          Popular Cocktails
        </h2>
        <Suspense>
          <SearchBar></SearchBar>
        </Suspense>
        <div className="mt-8">
          <InfiniteScroll />
        </div>
      </div>
    </div>
  );
}
