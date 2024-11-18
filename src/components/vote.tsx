"use client";

import { vote, type Drink } from "@/lib/drinks";
import { useState, useTransition } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  HiHandThumbDown,
  HiHandThumbUp,
  HiOutlineHandThumbDown,
  HiOutlineHandThumbUp,
} from "react-icons/hi2";
import { toast } from "sonner";

type Props = { drink: Drink };

export function Vote({ drink }: Props) {
  const [isPending, startTransition] = useTransition();
  const [latestVote, setLatestVote] = useState(drink.vote);
  const [thumbsUpCount, setThumbsUpCount] = useState(drink.thumbsUp);
  const [thumbsDownCount, setThumbsDownCount] = useState(drink.thumbsDown);

  const onClickVote = (choice: "up" | "down") => {
    startTransition(async () => {
      const result = await vote(drink.id, choice);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        setLatestVote((value) => (choice != value ? choice : undefined));
        setThumbsUpCount(result.thumbs_up);
        setThumbsDownCount(result.thumbs_down);
      }
    });
  };

  const ThumbUpIcon = latestVote == "up" ? HiHandThumbUp : HiOutlineHandThumbUp;
  const ThumbDownIcon =
    latestVote == "down" ? HiHandThumbDown : HiOutlineHandThumbDown;

  return (
    <div className="flex items-center flex-end">
      {isPending && (
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      )}
      {!isPending && (
        <div
          onClick={(evt) => {
            evt.preventDefault();
            onClickVote("up");
          }}
          className="flex items-center text-palette-yale_blue-700 focus:outline-none cursor-pointer"
        >
          <ThumbUpIcon className="text-2xl" />
          <span className="ml-1 text-lg font-bold">{thumbsUpCount}</span>
        </div>
      )}

      {isPending && (
        <FaSpinner className="animate-spin text-palette-tomato text-4xl" />
      )}

      {!isPending && (
        <div
          onClick={(evt) => {
            evt.preventDefault();
            onClickVote("down");
          }}
          className="flex items-center text-palette-tomato focus:outline-none ml-4 cursor-pointer"
        >
          <ThumbDownIcon className="text-2xl" />
          <span className="ml-1 text-lg font-bold">{thumbsDownCount}</span>
        </div>
      )}
    </div>
  );
}
