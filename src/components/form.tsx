"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { generateIdea } from "@/lib/drinks";
import { useUser } from "@clerk/nextjs";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { FaSpinner } from "react-icons/fa";

export function Form() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string>("");
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const triggerAction = useCallback(
    (ingredients: string) => {
      if (!user) {
        console.log("user not found in triggerAction");
        return;
      }

      startTransition(async () => {
        setError(null);
        const result = await generateIdea(ingredients);
        if (typeof result == "string") {
          if (result == "No enough credits.") {
            router.push(`/tip`);
          } else setError(result);
        } else {
          router.push(`/drink/${result.slug}`);
        }
      });
    },
    [router, user],
  );

  function onClickGenerateIdea() {
    if (isSignedIn) {
      triggerAction(ingredients);
    } else {
      localStorage.setItem("ingredients", ingredients);
      router.push("/sign-up");
      return;
    }
  }

  useEffect(() => {
    const ingredients = localStorage.getItem(`ingredients`);

    if (user && ingredients) {
      setIngredients(ingredients);
      localStorage.removeItem("ingredients");
      triggerAction(ingredients);
    }
  }, [user, triggerAction]);

  return (
    <>
      <Textarea
        placeholder="Tell us what you have ! e.g Cachaça, Lemon, Sugar ...  "
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
