"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { generateIdea } from "@/lib/drinks";
import { useState, useTransition } from "react";
import { FaSpinner } from "react-icons/fa";

export function Form() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState("");

  function onClickGenerateIdea() {
    startTransition(async () => {
      setError(null);

      const result = await generateIdea("dev", ingredients);
      if (typeof result == "string") {
        setError(result);
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

      {error}

      <p className="text-sm text-muted-foreground text-center">
        Choose what&lsquo;s on hand, and we&lsquo;ll find the perfect drink for
        you.
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
