import { SearchLoading } from "@/components/search/SearchLoading";
import { Suspense } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={<SearchLoading />}>{children}</Suspense>;
}
