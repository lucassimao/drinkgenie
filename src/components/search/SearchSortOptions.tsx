import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SortOption {
  value: string;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "latest", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "quick", label: "Quickest to Make" },
  { value: "ingredients", label: "Fewest Ingredients" },
];

export function SearchSortOptions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sortBy = searchParams.get("sortBy");

  function onSortChange(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", value);

    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <SlidersHorizontal className="h-5 w-5 text-primary/60" />
      <select
        defaultValue={sortBy || "latest"}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 bg-white rounded-lg border border-primary/20 text-primary
                 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by: {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
