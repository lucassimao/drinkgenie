"use client";

import { usePromise } from "@/hooks/usePromise";
import { getDrinks } from "@/lib/drinks";
import { DEFAULT_PAGE_SIZE } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { DrinkCard } from "./DrinkCard";
import { Drink } from "@/types/drink";

interface DrinksListProps {
  initialData: Awaited<ReturnType<typeof getDrinks>>;
  initialPage: number;
}

export function DrinkList({ initialData, initialPage }: DrinksListProps) {
  const searchParams = useSearchParams();

  // const user = await currentUser();
  const page = Number(searchParams.get("page")) || 1;
  const ingredient = searchParams.get("ingredient") as string;
  const difficulty = searchParams.get("difficulty") as string;

  const drinks = usePromise(
    `drinks-page-${page}`,
    () =>
      Promise.race<Drink[]>([
        getDrinks({
          pageSize: DEFAULT_PAGE_SIZE,
          page,
          ingredient,
          difficulty,
          sortBy: "latest",
        }),

        new Promise<Drink[]>((_, reject) => {
          setTimeout(reject, 1_000);
        }),
      ]),
    {
      ttl: 60000,
      shouldInvalidate: false,
      initialData: page === initialPage ? initialData : undefined,
    },
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {drinks &&
        drinks.map((drink) => (
          <div key={drink.id} className="relative">
            <DrinkCard drink={drink} />
          </div>
        ))}
    </div>
  );
}
