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

type Props = { drink: Drink; displayPreparationSteps?: boolean };

export function Drink({ drink, displayPreparationSteps = false }: Props) {
  return (
    // transition-transform transform hover:scale-105 duration-300 ease-in-out
    <Card className="mb-6 p-5 w-full bg-white rounded-lg shadow-lg hover:shadow-2xl text-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-extrabold text-palette-yale_blue text-center mb-2">
          {drink.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          className="w-full h-auto rounded-lg object-cover"
          width={300}
          height={300}
          src={drink.imageUrl}
          alt={drink.description}
        />
      </CardContent>
      <div className="flex justify-between mx-4	 pb-4">
        <Avatar className="mt-0 w-[25px] h-[25px]">
          <AvatarImage src={drink.userProfileImageUrl} />
        </Avatar>

        <div className="flex items-center flex-end">
          <Vote kind="up" drink={drink} />
          <Vote kind="down" drink={drink} />
        </div>
      </div>

      <p className="text-justify indent-8 pb-4">{drink.description}</p>

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

      <CardFooter>
        <IngredientBadges drink={drink} />
      </CardFooter>
    </Card>
  );
}
