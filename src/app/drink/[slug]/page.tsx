import { ParsedUrlQuery } from "querystring";

import { Drink } from "@/components/drink";
import { getDrinkBySlug } from "@/lib/drinks";
import { notFound } from "next/navigation";

interface DrinkDetailProps {
  params: Promise<ParsedUrlQuery>;
}

export default async function DrinkDetail({ params }: DrinkDetailProps) {
  const slug = (await params).slug as string;

  if (!slug) {
    notFound();
    return;
  }

  const drink = await getDrinkBySlug(slug);

  if (!drink) {
    notFound();
  }

  return (
    <main className="m-5 mt-0">
      <Drink displayPreparationSteps={true} drink={drink} />;
    </main>
  );
}
