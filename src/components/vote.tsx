"use client";

import { thumbsDown, thumbsUp, type Drink } from "@/lib/drinks";
import { useUser } from "@clerk/nextjs";
import { useActionState } from "react";
import { FaSpinner } from "react-icons/fa";
import { HiOutlineHandThumbDown, HiOutlineHandThumbUp } from "react-icons/hi2";
import { toast } from "sonner";

type Props = { drink: Drink; kind: "up" | "down" };

export function Vote({ drink, kind }: Props) {
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

  return (
    <div className="flex items-center flex-end">
      {kind == "up" && (
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
      )}

      {kind == "down" && (
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
      )}
    </div>
  );
}
