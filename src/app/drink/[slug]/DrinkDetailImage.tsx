import { SocialShare } from "@/components/SocialShare";
import { getRelativeTimeString } from "@/lib/dateUtils";
import { Drink } from "@/types/drink";
import Image from "next/image";

interface DrinkDetailProps {
  drink: Drink;
}

export function DrinkDetailImage({ drink }: DrinkDetailProps) {
  if (!drink.imageUrl) {
    return null;
  }

  const creatorName =
    drink.creator.firstName || drink.creator.username || "Author";

  return (
    <div className="relative h-96">
      <Image
        src={drink.imageUrl}
        alt={drink.name}
        width={1024}
        height={1024}
        className="w-full h-full object-cover object-left-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display text-white mb-4">
              {drink.name}
            </h1>
            {drink.creator && (
              <div className="flex items-center gap-3">
                <Image
                  src={drink.creator.imageUrl}
                  alt={creatorName}
                  width={64}
                  height={64}
                  className="w-10 h-10 rounded-full border-2 border-white/50"
                />
                <div>
                  <p className="text-white/90">{creatorName}</p>
                  <p className="text-sm text-white/70">
                    {getRelativeTimeString(drink.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="self-end">
            <SocialShare
              url={`https://drinkgenie.app/drink/${drink.slug}`}
              title={drink.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
