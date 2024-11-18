"use client";

import { Badge } from "@/components/ui/badge";
import { type Drink } from "@/lib/drinks";
import { useRouter, useSearchParams } from "next/navigation";

type Props = { drink: Drink };

export function IngredientBadges({ drink }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function onClickIngredient(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    // Prevent event from reaching Link
    event.preventDefault();
    const target = event.target as HTMLElement;

    // Check if the target element has the desired data attribute
    if (!target.dataset?.ingredient) {
      throw new Error("No ingredient!");
    }

    const params = new URLSearchParams(searchParams);
    params.set("ingredient", target.dataset?.ingredient);
    router.push(`/?${params.toString()}`, { scroll: true });
  }

  return (
    <div
      className="flex flex-wrap justify-center p-4 bg-gradient-to-r from-beige to-naples-yellow rounded-b-lg"
      onClick={onClickIngredient}
    >
      {drink.ingredients?.map((ingredient) => (
        <Badge
          key={ingredient}
          data-ingredient={ingredient}
          className="text-sm mr-2 mb-2 bg-palette-sandy_brown text-white px-3 py-1 rounded-full"
        >
          {ingredient}
        </Badge>
      ))}
    </div>
  );
}
