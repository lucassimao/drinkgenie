"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { thumbsDown, thumbsUp, type Drink } from "@/lib/drinks";
import Image from "next/image";
import { useActionState } from "react";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

type Props = { drink: Drink };

export function Drink({ drink }: Props) {
  const [state, thumbsUpAction, isPending] = useActionState(
    thumbsUp,
    drink.thumbsUp || 0,
  );
  const [state2, thumbsDownAction, isPending2] = useActionState(
    thumbsDown,
    drink.thumbsDown || 0,
  );

  return (
    <Card className="mb-6 ml-3 w-full bg-white rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out">
      <CardHeader>
        <CardTitle className="text-xl font-extrabold text-palette-yale_blue text-center mb-2">
          {drink.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Image
          className="w-full h-auto rounded-lg object-cover"
          width={300}
          height={300}
          src={drink.imageUrl}
          alt={drink.name}
        />
      </CardContent>
      <div className="flex justify-around items-center py-4">
        <div className="flex items-center">
          <form action={thumbsUpAction}>
            <input type="hidden" name="drinkId" value={drink.id} />
            {isPending && (
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            )}
            {!isPending && (
              <button className="flex items-center text-palette-yale_blue-700 focus:outline-none">
                <FaRegThumbsUp className="text-2xl" />
                <span className="text-lg font-bold">{state}</span>
              </button>
            )}
          </form>
        </div>
        <div className="flex items-center">
          <form action={thumbsDownAction}>
            <input type="hidden" name="drinkId" value={drink.id} />
            {isPending2 && (
              <FaSpinner className="animate-spin text-palette-tomato text-4xl" />
            )}

            {!isPending2 && (
              <button className="flex items-center text-palette-tomato focus:outline-none">
                <FaRegThumbsDown className="text-2xl" />
                <span className="text-lg font-bold">{state2}</span>
              </button>
            )}
          </form>
        </div>
      </div>
      <CardFooter className="flex flex-wrap justify-center p-4 bg-gradient-to-r from-beige to-naples-yellow rounded-b-lg">
        {drink.ingredients?.map((ingredient) => (
          <Badge
            className="text-sm mr-2 mb-2 bg-palette-sandy_brown text-white px-3 py-1 rounded-full"
            key={ingredient}
          >
            {ingredient}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
