import { ParsedUrlQuery } from "querystring";

import { Drink } from "@/components/drink";
import { getAllDrinkSlugs, getDrinkBySlug } from "@/lib/drinks";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata, ResolvingMetadata } from "next";

interface DrinkDetailProps {
  params: Promise<ParsedUrlQuery>;
}

export async function generateStaticParams() {
  const allDrinkSlugs = await getAllDrinkSlugs();

  return allDrinkSlugs.map((slug) => ({
    slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug as string;

  if (!slug) {
    throw new Error("no slug");
  }

  const drink = await getDrinkBySlug(slug);

  if (!drink) {
    throw new Error("no drink " + slug);
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: drink.name,
    description: drink.description,
    openGraph: {
      images: [drink.imageUrl, ...previousImages],
      siteName: "DrinkGenie",
      url: `https://drinkgenie.app/drinks/${slug}`,
    },
  };
}

export default async function DrinkDetail({ params }: DrinkDetailProps) {
  const slug = (await params).slug as string;

  if (!slug) {
    notFound();
  }

  const drink = await getDrinkBySlug(slug);

  if (!drink) {
    notFound();
  }

  return (
    <main className="m-5 mt-0">
      <div className="w-[768px] container mx-auto">
        <Suspense
          fallback={<Skeleton className="w-[100px] h-[20px] rounded-full" />}
        >
          <Drink displayPreparationSteps={true} allIngredients drink={drink} />
        </Suspense>
      </div>
    </main>
  );
}
