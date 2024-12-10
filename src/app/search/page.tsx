"use client";

import { DrinkCard } from "@/components/DrinkCard";
import { SearchBreadcrumbs } from "@/components/search/SearchBreadcrumbs";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchLoading } from "@/components/search/SearchLoading";
import { SearchSortOptions } from "@/components/search/SearchSortOptions";
import { ViewToggle } from "@/components/search/ViewToggle";
import { useToast } from "@/hooks/useToast";
import { findBy } from "@/lib/drinks";
import { DEFAULT_PAGE_SIZE } from "@/lib/utils";
import { Drink } from "@/types/drink";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [view, setView] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const toast = useToast();

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const ingredient = searchParams.get("ingredient");
    const difficulty = searchParams.get("difficulty");
    // eslint-disable-next-line
    const sortBy = (searchParams.get("sortBy") as any) || "latest";

    if (!query) return;

    findBy({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      difficulty,
      ingredient,
      sortBy,
      keyword: query,
    })
      .then((drinks) => {
        setDrinks(drinks);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error(`Something went wrong.`, "Ooops");
        setIsLoading(false);
      });
  }, [searchParams, query, toast]);

  if (isLoading) {
    return <SearchLoading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SearchBreadcrumbs />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <SearchFilters />
        </div>

        {/* Results Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-primary">
                {drinks.length} results for &quot;{query}&quot;
              </h2>
              <p className="text-primary/60 mt-1">Find your perfect drink</p>
            </div>
            <div className="flex items-center gap-4">
              <SearchSortOptions />
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </div>

          {/* Results Grid */}
          <div
            className={`grid gap-6 ${
              view === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {drinks.map((cocktail) => (
              <DrinkCard key={cocktail.id} drink={cocktail} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
