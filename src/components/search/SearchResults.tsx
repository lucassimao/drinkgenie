"use client";

import { DrinkCard } from "@/components/DrinkCard";
import { SearchLoading } from "@/components/search/SearchLoading";
import { SearchSortOptions } from "@/components/search/SearchSortOptions";
import { useToast } from "@/hooks/useToast";
import { DrinkWithTotal, getDrinks } from "@/lib/drinks";
import { DEFAULT_PAGE_SIZE } from "@/lib/utils";
import { track } from "@vercel/analytics";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination } from "../Pagination";

// Define type for sort options
type SortBy =
  | "latest"
  | "relevance"
  | "popular"
  | "rating"
  | "quick"
  | "ingredients";

// Extract search params interface
type SearchParams = {
  page: number;
  ingredient: string | null;
  difficulty: string | null;
  sortBy: SortBy;
  query: string | null;
  alcoholContent: string[];
  flavorProfile: string[];
  glassware: string[];
  temperature: string[];
};

type SearchResultsState = {
  isLoading: boolean;
  drinks: DrinkWithTotal[];
  error: Error | null;
};

const SEARCH_TIMEOUT = 5_000;

export function SearchResults() {
  const searchParams = useSearchParams();
  const toast = useToast();

  const [state, setState] = useState<SearchResultsState>({
    isLoading: false,
    drinks: [],
    error: null,
  });

  // Memoize search parameters to avoid unnecessary re-renders
  const params = useMemo(
    (): SearchParams => ({
      page: Number(searchParams.get("page")) || 1,
      ingredient: searchParams.get("ingredient"),
      difficulty: searchParams.get("difficulty"),
      sortBy: (searchParams.get("sortBy") as SortBy) || "latest",
      query: searchParams.get("query"),
      alcoholContent: searchParams.getAll("alcoholContent"),
      flavorProfile: searchParams.getAll("flavorProfile"),
      glassware: searchParams.getAll("glassware"),
      temperature: searchParams.getAll("temperature"),
    }),
    [searchParams],
  );

  const searchResultsPaginationStrategy = useCallback(
    (page: number): string => {
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.set("page", String(page));
      return `/search?${updatedParams.toString()}`;
    },
    [searchParams],
  );

  // Extract search logic into a separate function
  const performSearch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const findByPromise = getDrinks({
        page: params.page,
        pageSize: DEFAULT_PAGE_SIZE,
        difficulty: params.difficulty,
        ingredient: params.ingredient,
        sortBy: params.sortBy,
        keyword: params.query,
        alcoholContent: params.alcoholContent,
        flavorProfile: params.flavorProfile,
        glassware: params.glassware,
        temperature: params.temperature,
        withTotalDrinks: true,
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        const id = setTimeout(() => {
          clearTimeout(id);
          track("SearchTimeout", {
            keyword: params.query,
          });
          reject(new Error(`Timed out after ${SEARCH_TIMEOUT}ms`));
        }, SEARCH_TIMEOUT);
      });

      const drinks = await Promise.race([findByPromise, timeoutPromise]);
      if (process.env.NODE_ENV == "production") {
        track("Search", {
          keyword: params.query,
        });
      }

      setState((prev) => ({ ...prev, drinks, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error("Unknown error"),
        isLoading: false,
      }));
    }
  }, [params]);

  // Handle search
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Handle errors
  useEffect(() => {
    if (!state.error) return;

    console.error(state.error);

    if (state.error.message !== `Timed out after ${SEARCH_TIMEOUT}ms`) {
      toast.error("Something went wrong.", "Oops");
    }

    setState((prev) => ({ ...prev, error: null }));
  }, [state.error, toast]);

  if (state.isLoading) {
    return <SearchLoading />;
  }

  const totalDrinks = state.drinks?.[0]?.totalDrinks || 0;
  const totalPages = Math.ceil(totalDrinks / DEFAULT_PAGE_SIZE);

  return (
    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-primary">
            {params.query
              ? `${totalDrinks} results for "${params.query}"`
              : "Search results"}
          </h2>
          <p className="text-primary/60 mt-1">Find your perfect drink</p>
        </div>
        <div className="flex items-center gap-4">
          <SearchSortOptions />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {state.drinks.map((cocktail) => (
          <DrinkCard key={cocktail.id} drink={cocktail} />
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          hrefStrategy={searchResultsPaginationStrategy}
          currentPage={params.page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
