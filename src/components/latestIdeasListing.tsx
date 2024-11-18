import { countDrinks, getLatestDrinkIdeas } from "@/lib/drinks";

import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Drink } from "./drink";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type Props = {
  page: number;
  ingredient?: string;
};
export async function LatestIdeasListing({ page, ingredient }: Props) {
  const user = await currentUser();

  const [latestDrinkIdeas, drinksTotal] = await Promise.all([
    getLatestDrinkIdeas(10, +page || 1, ingredient, user?.id),
    countDrinks(ingredient),
  ]);

  const lastPage = Math.ceil(drinksTotal / 10);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4 max-w-7xl">
        {latestDrinkIdeas.map((drink) => (
          <div className="h-[700px] " key={drink.id}>
            <Link href={`/drink/${drink.slug}`}>
              <Drink drink={drink} />
            </Link>
          </div>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`/?page=${page - 1}`} />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>
          </PaginationItem>

          {page != lastPage && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext href={`/?page=${page + 1}`} />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
