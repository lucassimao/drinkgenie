"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useSearchParams } from "next/navigation";

export function SearchBreadcrumbs() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Search Results", path: "/search" },
    { label: query ? `"${query}"` : "Recipe Book" },
  ];

  return <Breadcrumbs items={breadcrumbs} />;
}
