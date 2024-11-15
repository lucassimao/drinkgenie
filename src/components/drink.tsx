"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { thumbsDown, thumbsUp, type Drink } from "@/lib/drinks";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import { FaSpinner } from "react-icons/fa";
import { HiOutlineHandThumbDown, HiOutlineHandThumbUp } from "react-icons/hi2";
import { toast } from "sonner";
type Props = { drink: Drink; displayPreparationSteps?: boolean };

export function Drink({ drink, displayPreparationSteps = false }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isSignedIn } = useUser();

  const [thumbsUpState, thumbsUpAction, isThumbsUpActionPending] =
    useActionState(thumbsUp, drink.thumbsUp || 0);

  const [thumbsDownState, thumbsDownAction, isThumbsDownActionPending] =
    useActionState(thumbsDown, drink.thumbsDown || 0);

  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSignedIn) {
      toast.error("You must be signed in to vote.");
      event.preventDefault();
    }
    // Prevent event from reaching Link
    event.stopPropagation();
  };

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
    router.push(`/?${params.toString()}`);
  }

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
          <form action={thumbsUpAction} className="mr-4">
            <input type="hidden" name="drinkId" value={drink.id} />
            {isThumbsUpActionPending && (
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            )}
            {!isThumbsUpActionPending && (
              <button
                onClick={onButtonClick}
                className="flex items-center text-palette-yale_blue-700 focus:outline-none"
              >
                <HiOutlineHandThumbUp className="text-2xl" />
                <span className="text-lg font-bold">{thumbsUpState}</span>
              </button>
            )}
          </form>
          <form action={thumbsDownAction}>
            <input type="hidden" name="drinkId" value={drink.id} />
            {isThumbsDownActionPending && (
              <FaSpinner className="animate-spin text-palette-tomato text-4xl" />
            )}

            {!isThumbsDownActionPending && (
              <button
                onClick={onButtonClick}
                className="flex items-center text-palette-tomato focus:outline-none"
              >
                <HiOutlineHandThumbDown className="text-2xl" />
                <span className="text-lg font-bold">{thumbsDownState}</span>
              </button>
            )}
          </form>
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

      <CardFooter
        onClick={onClickIngredient}
        className="flex flex-wrap justify-center p-4 bg-gradient-to-r from-beige to-naples-yellow rounded-b-lg"
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
      </CardFooter>
    </Card>
  );
}
