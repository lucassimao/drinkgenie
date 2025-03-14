"use client";

import { History, Search, TrendingUp, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname } from "next/navigation";
import { getSearchStats } from "@/lib/redis";

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const [params, setParamsState] = useState<URLSearchParams>(useSearchParams());
  const pathname = usePathname();

  const [popularSearches, setPopularSearches] = useState<string[]>([
    "Mojito",
    "Margarita",
    "Old Fashioned",
    "Martini",
  ]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Gin and Tonic",
    "Moscow Mule",
    "Daiquiri",
  ]);

  useEffect(() => {
    if (!pathname.startsWith("/search")) {
      setIsFocused(false);
      setParamsState(new URLSearchParams(""));
    }
  }, [pathname]);

  useEffect(() => {
    getSearchStats()
      .then(({ popularSearches, recentSearches }) => {
        if (popularSearches.length > 0) setPopularSearches(popularSearches);
        if (recentSearches.length > 0) setRecentSearches(recentSearches);
      })
      .catch(console.error);
  }, []);

  const search = (keyword: string, hardRefresh = false) => {
    const clonnedParams = new URLSearchParams(params);

    if (keyword && keyword.length >= 3) {
      clonnedParams.set("query", keyword);

      setParamsState(clonnedParams);
      setIsFocused(false);
      if (hardRefresh) {
        window.location.href = `/search?${clonnedParams.toString()}`;
      } else {
        router.replace(`/search?${clonnedParams.toString()}`);
      }
    }
  };

  const debouncedSearch = useDebouncedCallback(
    search,
    // delay in ms
    300,
  );

  const onClearSearch = () => {
    const clonnedParams = new URLSearchParams(params);
    clonnedParams.delete("query");
    setIsFocused(false);
    setParamsState(clonnedParams);
    router.replace(`/`);
  };

  // eslint-disable-next-line
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      search(e.target.value, true);
      setIsFocused(false);
    } else if (e.key == "Escape") {
      setIsFocused(false);
    }
  };

  const query = params.get("query") || "";

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative z-10">
        {" "}
        {/* Added z-index */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-primary/40" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2.5 bg-white border-2 border-primary/20 rounded-xl 
                   text-primary placeholder-primary/40 shadow-[0_2px_8px_rgba(74,111,165,0.06)]
                   focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 
                   transition-all duration-300 text-base hover:border-primary/30"
          placeholder="Search cocktails, ingredients, or flavors..."
          defaultValue={query}
          onChange={(e) => debouncedSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {query && (
          <button
            onClick={onClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-primary/40 hover:text-primary/60 transition-colors" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-primary/10 py-3 z-50">
          {/* Popular Searches */}
          <div className="px-4 mb-2">
            <div className="flex items-center gap-2 text-sm text-primary/60 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => search(term)}
                  className="px-3 py-1.5 text-sm bg-background rounded-full text-primary hover:bg-secondary/10 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div className="border-t border-primary/5 mt-3 pt-3 px-4">
            <div className="flex items-center gap-2 text-sm text-primary/60 mb-2">
              <History className="h-4 w-4" />
              <span>Recent Searches</span>
            </div>
            <div className="space-y-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => search(term)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-primary hover:bg-background rounded-lg transition-colors"
                >
                  <History className="h-4 w-4 text-primary/40" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
