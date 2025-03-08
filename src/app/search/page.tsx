import { SearchBreadcrumbs } from "@/components/search/SearchBreadcrumbs";
import { SearchBreadcrumbsFallback } from "@/components/search/SearchBreadcrumbsFallback";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchFiltersFallback } from "@/components/search/SearchFiltersFallback";
import { SearchLoading } from "@/components/search/SearchLoading";
import { SearchResults } from "@/components/search/SearchResults";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<SearchBreadcrumbsFallback />}>
        <SearchBreadcrumbs />
      </Suspense>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 shrink-0">
          <Suspense fallback={<SearchFiltersFallback />}>
            <SearchFilters />
          </Suspense>
        </div>

        {/* Results Content */}
        <Suspense fallback={<SearchLoading />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
