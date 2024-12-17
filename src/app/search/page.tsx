import { SearchBreadcrumbs } from "@/components/search/SearchBreadcrumbs";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense>
        <SearchBreadcrumbs />
      </Suspense>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Suspense>
            <SearchFilters />
          </Suspense>
        </div>

        {/* Results Content */}
        <Suspense>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
