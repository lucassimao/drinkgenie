import { Drink } from "@/types/drink";
import clsx from "clsx";
import { GlassWater } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type DrinkImageProps = {
  drink: Drink;
};
export const DrinkImage = ({ drink }: DrinkImageProps) => {
  if (!drink.imageUrl) {
    return (
      <div className="relative h-full bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <GlassWater className="h-8 w-8 text-primary/30 mx-auto mb-2" />
            <p className="text-sm text-primary/40">{drink.name}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-full overflow-hidden">
      <Link href={`/drink/${drink.slug}`}>
        <Image
          width={drink.width}
          height={drink.height}
          src={drink.imageUrl}
          alt={drink.name}
          className={clsx(
            "w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300",
            { "object-left-top": drink.width == 1024 && drink.height == 1024 },
            { "object-center": drink.width == 1820 && drink.height == 1024 },
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </div>
  );
};
