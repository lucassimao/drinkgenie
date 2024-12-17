import { Breadcrumbs } from "@/components/Breadcrumbs";

export function SearchBreadcrumbsFallback() {
  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Search Results" },
  ];

  return <Breadcrumbs items={breadcrumbs} />;
}
