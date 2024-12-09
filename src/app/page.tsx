import { DrinkList } from "@/components/DrinkList";
import { IngredientForm } from "@/components/IngredientForm";
import { Pagination } from "@/components/Pagination";
import { SectionDivider } from "@/components/SectionDivider";
import { Testimonials } from "@/components/Testimonials";
import { VideoTutorials } from "@/components/VideoTutorials";
import { countDrinks, findBy } from "@/lib/drinks";
import { DEFAULT_PAGE_SIZE } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

export const maxDuration = 60; // Applies to the actions

export default async function Home(props: {
  searchParams?: Promise<{
    page?: string;
    ingredient?: string;
    difficulty?: string;
  }>;
}) {
  const page = +((await props.searchParams)?.page as string) || 1;
  const ingredient = (await props.searchParams)?.ingredient as string;
  const difficulty = (await props.searchParams)?.difficulty as string;
  const searchParams = new URLSearchParams(await props.searchParams);

  const user = await currentUser();
  const drinks = await findBy({
    pageSize: DEFAULT_PAGE_SIZE,
    page,
    ingredient,
    loggedInUserId: user?.id,
    difficulty,
    sortBy: "latest",
  });
  const totalPages = Math.ceil(
    (await countDrinks(ingredient, difficulty)) / DEFAULT_PAGE_SIZE,
  );

  const displayTutorialsAndTestmonials = false;

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
        <DrinkList searchParams={searchParams.toString()} cocktails={drinks} />
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        )}
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
