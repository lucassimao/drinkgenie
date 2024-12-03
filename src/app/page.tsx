import { CocktailList } from "@/components/DrinkList";
import { IngredientForm } from "@/components/IngredientForm";
import { Pagination } from "@/components/Pagination";
import { SectionDivider } from "@/components/SectionDivider";
import { Testimonials } from "@/components/Testimonials";
import { VideoTutorials } from "@/components/VideoTutorials";
import { getLatestDrinkIdeas } from "@/lib/drinks";

export const maxDuration = 60; // Applies to the actions

export default async function Home(props: {
  searchParams?: Promise<{
    page?: string;
    ingredient?: string;
  }>;
}) {
  const page = +((await props.searchParams)?.page as string) || 1;
  const ingredient = (await props.searchParams)?.ingredient as string;
  const isHomePage = page == 1 && !ingredient;
  const cocktails = await getLatestDrinkIdeas(12, page);

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
        <CocktailList
          currentPage={page}
          itemsPerPage={12}
          cocktails={cocktails}
        />
        {/* {totalPages > 1 && ( */}
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={100}
            // onPageChange={(page) => console.log(page)}
          />
        </div>
        {/* )} */}
      </div>

      <div className="space-y-16 mb-16">
        <VideoTutorials />
        <Testimonials />
      </div>
    </main>
  );
}
