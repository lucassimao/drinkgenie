import { ParsedUrlQuery } from "querystring";

import { Drink } from "@/components/drink";
import { getAllDrinkSlugs, getDrinkBySlug } from "@/lib/drinks";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DrinkDetailProps {
  params: Promise<ParsedUrlQuery>;
}

export async function generateStaticParams() {
  const allDrinkSlugs = await getAllDrinkSlugs();

  return allDrinkSlugs.map((slug) => ({
    slug,
  }));
}

export default async function DrinkDetail({ params }: DrinkDetailProps) {
  const slug = (await params).slug as string;

  if (!slug) {
    notFound();
  }

  const drink = await getDrinkBySlug(slug);

  if (!drink) {
    notFound();
  }

  return (
    <main className="m-5 mt-0">
      <Suspense
        fallback={<Skeleton className="w-[100px] h-[20px] rounded-full" />}
      >
        <Drink displayPreparationSteps={true} drink={drink} />
      </Suspense>
    </main>
  );
}
