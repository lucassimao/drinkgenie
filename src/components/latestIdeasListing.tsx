import { countDrinks, getLatestDrinkIdeas } from "@/lib/drinks";

import { Drink } from "./drink";
import Link from "next/link";
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
};
export async function LatestIdeasListing({ page }: Props) {
  const [latestDrinkIdeas, drinksTotal] = await Promise.all([
    getLatestDrinkIdeas(10, +page || 1),
    countDrinks(),
  ]);

  const lastPage = Math.ceil(drinksTotal / 10);

  return (
    <div className="flex flex-wrap justify-between">
      {latestDrinkIdeas.map((drink) => (
        <Link key={drink.id} href={`/drink/${drink.slug}`}>
          <Drink drink={drink} />
        </Link>
      ))}

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
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          {page != lastPage && (
            <PaginationItem>
              <PaginationNext href={`/?page=${page + 1}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
