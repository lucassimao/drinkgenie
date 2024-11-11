"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { generateIdea } from "@/lib/drinks";
import { useUser } from "@clerk/nextjs";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaSpinner } from "react-icons/fa";

export const maxDuration = 60; // Applies to the actions

export function Form() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState("");
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  function onClickGenerateIdea() {
    if (!isSignedIn) {
      localStorage.setItem("ingredients", ingredients);
      router.push("sign-up");
      return;
    }

    startTransition(async () => {
      setError(null);

      const userInfo = { id: user.id, imageUrl: user.imageUrl }; // can't pass the original user. clonning it
      const result = await generateIdea(userInfo, ingredients);
      if (typeof result == "string") {
        setError(result);
      } else {
        router.push(`drink/${result.slug}`);
      }
    });
  }

  return (
    <>
      <Textarea
        placeholder="Tell us what you have, and we'll mix up some magic!"
        className="bg-white mt-5 mb-3 h-auto min-h-[150px] max-h-[500px]"
        required
        name="ingredients"
        value={ingredients}
        onChange={(evt) => setIngredients(evt.target.value)}
      />

      <p
        className={clsx({
          "text-sm text-red text-center text-palette-tomato": error != null,
          "text-sm text-muted-foreground text-center": error == null,
        })}
      >
        {error ||
          `Choose what's on hand, and we'll find the perfect drink for you.`}
      </p>

      <Button
        disabled={isPending}
        onClick={onClickGenerateIdea}
        className="my-5 p-8 font-bold text-2xl shadow-md hover:shadow-lg active:scale-95 active:shadow-sm transition transform duration-150"
      >
        {isPending && (
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        )}
        Pour Me Some Ideas
      </Button>
    </>
  );
}
