import { DrinkList } from "@/components/DrinkList";
import { DrinkListFallback } from "@/components/DrinkListFallback";
import { IngredientForm } from "@/components/IngredientForm";
import { Pagination } from "@/components/Pagination";
import { SectionDivider } from "@/components/SectionDivider";
import { Testimonials } from "@/components/Testimonials";
import { VideoTutorials } from "@/components/VideoTutorials";
import { countDrinks, getDrinks } from "@/lib/drinks";
import { DEFAULT_PAGE_SIZE } from "@/lib/utils";
import { Suspense } from "react";

export const maxDuration = 60; // Applies to the actions

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 3600; // 1hr

export default async function Home({ searchParams }: Props) {
  const displayTutorialsAndTestmonials = false;

  const { page, ingredient, difficulty } = await searchParams;
  const initialData = await getDrinks({
    page: Number(page) || 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "latest",
  });

  // Calculate total pages on the server
  const totalItems = await countDrinks(
    ingredient as string,
    difficulty as string,
  );
  const totalPages = Math.ceil(totalItems / DEFAULT_PAGE_SIZE);

  return (
    <main>
      <div className="py-12 max-w-2xl mx-auto">
        <IngredientForm />
      </div>

      <SectionDivider
        title="Magical Suggestions"
        subtitle="Discover cocktails crafted just for you"
      />

      <div className="mb-16">
        <Suspense fallback={<DrinkListFallback />}>
          <DrinkList
            initialPage={Number(page) || 1}
            initialData={initialData}
          />
        </Suspense>
        <div className="mt-8">
          <Suspense>
            <Pagination totalPages={totalPages} />
          </Suspense>
        </div>
      </div>

      {displayTutorialsAndTestmonials && (
        <div className="space-y-16 mb-16">
          <VideoTutorials />
          <Testimonials />
        </div>
      )}
    </main>
  );
}
