import { getRelativeTimeString } from "@/lib/dateUtils";
import { Drink as Cocktail } from "@/types/drink";
import { BarChart2, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteDrinkButton } from "../FavoriteDrinkButton";
import { DrinkImage } from "./DrinkImage";
import { PollingImageFetcher } from "./PollingImageFetcher";

type DrinkCardProps = {
  drink: Cocktail;
  searchParams?: string;
};

const getDifficultyColor = (difficulty: string = "Easy") => {
  switch (difficulty.toLowerCase()) {
    case "hard":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-amber-600 bg-amber-50";
    default:
      return "text-green-600 bg-green-50";
  }
};

export function DrinkCard({ drink, searchParams }: DrinkCardProps) {
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
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
                 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
                 flex flex-col h-full"
    >
      {/* Image Section with Loading State */}
      <div className="aspect-w-16 aspect-h-9 relative h-48 flex-shrink-0">
        {drink.imageUrl ? (
          <DrinkImage drink={drink} />
        ) : (
          <PollingImageFetcher drink={drink} />
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-display text-primary group-hover:text-secondary transition-colors line-clamp-2">
            <Link href={`/drinks/${drink.slug}`}> {drink.name}</Link>
          </h3>
          <FavoriteDrinkButton drink={drink} />
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {drink.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-sm bg-warning/20 text-primary rounded-full line-clamp-1"
                >
                  <Link
                    href={`/search?${appendSearchParam("query", ingredient)}`}
                  >
                    {ingredient}
                  </Link>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${getDifficultyColor(drink.difficulty)}`}
              >
                <BarChart2 className="h-4 w-4" />

                <span>
                  <Link
                    href={`/search?${appendSearchParam("query", drink.difficulty)}`}
                  >
                    {drink.difficulty}
                  </Link>
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm bg-primary/5 text-primary">
                <Clock className="h-4 w-4" />
                <span>{drink.preparationTime || "5 mins"}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-primary/10">
            <div className="flex items-center justify-between text-sm text-primary/60">
              <span className="text-sm text-primary/60">
                {getRelativeTimeString(drink.createdAt)}
              </span>
              <div className="flex items-center gap-2">
                <Image
                  width={1000}
                  height={1000}
                  src={drink.creator.imageUrl}
                  alt={drink.creator.fullName || ""}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="line-clamp-1">{drink.creator.firstName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
