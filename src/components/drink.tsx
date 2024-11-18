import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Drink } from "@/lib/drinks";
import Image from "next/image";
import { IngredientBadges } from "./ingredientBadges";
import { Vote } from "./vote";
import clsx from "clsx";
import { SocialShare } from "./socialShare";

type Props = {
  drink: Drink;
  displayPreparationSteps?: boolean;
  allIngredients?: boolean;
  displayShareButtons?: boolean;
};

export function Drink({
  drink,
  displayPreparationSteps = false,
  allIngredients,
  displayShareButtons,
}: Props) {
  return (
    // transition-transform transform hover:scale-105 duration-300 ease-in-out
    <Card className="mb-6 p-5 w-full h-full pb-0 bg-white rounded-lg shadow-lg hover:shadow-2xl text-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-extrabold text-palette-yale_blue text-center mb-2">
          {drink.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Image
          className="w-full h-auto rounded-lg object-cover"
          width={350}
          height={350}
          src={drink.imageUrl}
          alt={drink.description}
        />
      </CardContent>
      <div className="flex justify-between items-center mx-0 mt-2	 pb-4">
        <Avatar className="mt-0 w-[25px] h-[25px] md:w-[50px] md:h-[50px]">
          <AvatarImage src={drink.userProfileImageUrl} />
        </Avatar>
        {displayShareButtons && <SocialShare drink={drink} />}

        <Vote drink={drink} />
      </div>
      <p
        className={clsx("text-justify indent-8", {
          "md:line-clamp-5": !displayPreparationSteps,
        })}
      >
        {drink.description}
      </p>

      {displayPreparationSteps && (
        <div className="border-t-2 text-gray-700 pt-4">
          <h3 className="text-xl font-extrabold text-center mb-4">
            Preparation steps
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {drink.preparationSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      <CardFooter className="p-0 m-0">
        <IngredientBadges allIngredients={allIngredients} drink={drink} />
      </CardFooter>
    </Card>
  );
}
