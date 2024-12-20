import { DrinkCard } from "@/components/DrinkCard";
import { IngredientForm } from "@/components/IngredientForm";
import { Pagination } from "@/components/Pagination";
import { SectionDivider } from "@/components/SectionDivider";
import { Testimonials } from "@/components/Testimonials";
import { VideoTutorials } from "@/components/VideoTutorials";
import { countDrinks, getDrinks } from "@/lib/drinks";
import { DEFAULT_PAGE_SIZE } from "@/lib/utils";

export const maxDuration = 60; // Applies to the actions

interface Props {
  params: Promise<{ page?: string[] }>;
}

export const revalidate = 3600; // 1hr
const DISPLAY_TUTORIALS_AND_TESTMONIALS = false;

const homePagePaginationStrategy = (page: number) => `/${page}`;

export async function generateStaticParams() {
  const totalItems = await countDrinks();
  const totalPages = Math.ceil(totalItems / DEFAULT_PAGE_SIZE);

  return new Array(totalPages + 1) // +1 for the home page
    .fill(0)
    .map((_, index) => ({ page: index == 0 ? [] : [String(index)] })); // 0 meaning the home page
}

export default async function Home(props: Props) {
  const params = await props.params;
  const page = params.page?.[0] ? parseInt(params.page[0]) || 1 : 1;

  const drinks = await getDrinks({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "latest",
  });

  // Calculate total pages on the server
  const totalItems = await countDrinks();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {drinks.map((drink) => (
            <div key={drink.id} className="relative">
              <DrinkCard drink={drink} />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Pagination
            hrefStrategy={homePagePaginationStrategy}
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      </div>

      {DISPLAY_TUTORIALS_AND_TESTMONIALS && (
        <div className="space-y-16 mb-16">
          <VideoTutorials />
          <Testimonials />
        </div>
      )}
    </main>
  );
}
