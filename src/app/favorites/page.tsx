import { DrinkCard } from "@/components/DrinkCard";
import { Pagination } from "@/components/Pagination";
import { getFavoriteDrinks } from "@/lib/drinks";
import { DEFAULT_PAGE_SIZE } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type FavoritesPageProps = {
  searchParams: Promise<{ page?: string[] }>;
};

export default async function FavoritesPage({
  searchParams,
}: FavoritesPageProps) {
  // Check if user is authenticated
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  // Get current page from search params
  const params = await searchParams;
  const page = params.page?.[0] ? parseInt(params.page[0]) || 1 : 1;

  // Get favorited drinks directly using the getFavoriteDrinks function
  const favorites = await getFavoriteDrinks(user.id, page, DEFAULT_PAGE_SIZE);

  // Get total drinks for pagination
  const totalDrinks = favorites.length > 0 ? favorites[0].totalDrinks : 0;
  const totalPages = Math.ceil(totalDrinks / DEFAULT_PAGE_SIZE);

  const favoritePaginationStrategy = (page: number) =>
    `/favorites?page=${page}`;

  return (
    <main className="max-w-7xl mx-auto px-4">
      <div className="py-8">
        <h1 className="text-3xl font-display text-primary mb-6">
          Your Favorite Drinks
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-primary/70">
              You haven&apos;t favorited any drinks yet!
            </p>
            <p className="mt-2 text-primary/60">
              Browse our collection and click the heart icon to add drinks to
              your favorites.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((drink) => (
                <div key={drink.id} className="relative">
                  <DrinkCard hideFavoriteButton drink={drink} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  hrefStrategy={favoritePaginationStrategy}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
