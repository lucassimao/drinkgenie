"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useSearchParams } from "next/navigation";

export function SearchBreadcrumbs() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || 1;

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Search Results" },
    { label: `"${query}"` },
  ];

  return <Breadcrumbs items={breadcrumbs} />;
}
