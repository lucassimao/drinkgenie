import { Drink as Cocktail } from "@/types/drink";
import { Star } from "lucide-react";
import Link from "next/link";
import { FavoriteDrinkButton } from "../FavoriteDrinkButton";
import { DrinkCreator } from "./DrinkCreator";
import { DrinkImage } from "./DrinkImage";
import { CocktailStats } from "./DrinkStats";
import { PollingImageFetcher } from "./PollingImageFetcher";
import { SignedIn } from "@clerk/nextjs";

type DrinkCardProps = {
  drink: Cocktail;
  searchParams?: string;
  hideFavoriteButton?: boolean;
};

export function DrinkCard({
  drink,
  searchParams,
  hideFavoriteButton,
}: DrinkCardProps) {
  // Generate dynamic values for rating and reviewCount
  const rating = Math.round((1 + Math.random() * 4) * 10) / 10; // Random number between 1.0 and 5.0 with one decimal place
  const reviewCount = Math.floor(50 + Math.random() * 51); // Random integer between 50 and 100

  function appendSearchParam(key: string, value: string): string {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    params.set("page", "1");

    if (key == "difficulty" && params.has("ingredient")) {
      params.delete("ingredient");
    } else if (key == "ingredient" && params.has("difficulty")) {
      params.delete("difficulty");
    }

    return params.toString();
  }

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl 
               transition-all duration-500 transform hover:-translate-y-1 cursor-pointer
               flex flex-col h-full overflow-hidden border border-primary/5
               hover:border-primary/10"
    >
      {/* Image Section */}
      <div className="relative w-full pb-[56.25%] overflow-hidden">
        <div className="absolute inset-0">
          {drink.imageUrl ? (
            <DrinkImage drink={drink} />
          ) : (
            <PollingImageFetcher drink={drink} />
          )}
        </div>

        {/* Favorite Button - Top right */}
        {!hideFavoriteButton && (
          <div className="absolute top-4 right-4 z-10">
            <SignedIn>
              <div className="absolute top-4 right-4 z-10">
                <FavoriteDrinkButton drink={drink} />
              </div>
            </SignedIn>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4">
        {/* Main Content */}

        <div className="flex-1">
          {/* Header */}
          <div className="mb-2">
            <h3
              className="text-xlg font-display text-primary group-hover:text-accent 
                       transition-colors line-clamp-1 leading-tight mb-4"
            >
              <Link href={`/drink/${encodeURIComponent(drink.slug)}`}>
                {drink.name}
              </Link>
            </h3>

            {/* Rating */}
            <Link href={`/drink/${encodeURIComponent(drink.slug)}`} passHref>
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.floor(rating)
                          ? "text-warning fill-current"
                          : "text-primary/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-primary">
                  {rating}
                </span>
                <span className="text-xs text-primary/60">({reviewCount})</span>
              </div>
            </Link>
          </div>

          {/* Ingredients */}
          <div className="mb-2">
            <div className="flex flex-wrap gap-1.5">
              {drink.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-primary/5 text-primary/80 rounded-full 
                   hover:bg-primary/10 transition-colors"
                >
                  <Link
                    href={`/search?${appendSearchParam("query", ingredient)}`}
                    rel="nofollow"
                  >
                    {ingredient}
                  </Link>
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-2">
            <CocktailStats drink={drink} />
          </div>
        </div>

        {/* Creator Info - Always at bottom */}
        <div className="pt-2 border-t border-primary/10">
          <DrinkCreator
            creator={drink.creator?.firstName}
            creatorAvatarUrl={drink.creator?.imageUrl}
            created={drink.createdAt}
          />
        </div>
      </div>
    </div>
  );
}
