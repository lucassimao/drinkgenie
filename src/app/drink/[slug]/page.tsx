import { ParsedUrlQuery } from "querystring";

import { AffiliatedLinks } from "@/components/AffiliatedLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { findBy } from "@/lib/drinks";
import { ChefHat, Clock, Flower2, GlassWater } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { DrinkDetailImage } from "./DrinkDetailImage";
import { PollingImageFetcher } from "./PollingImageFetcher";
import { ViewRegister } from "./ViewRegister";

interface DrinkDetailProps {
  params: Promise<ParsedUrlQuery>;
}

export async function generateStaticParams() {
  // TODO debug SSR - maybe the database is throtling the calls?
  // const allDrinkSlugs = await getSlugsForSSR();

  // return allDrinkSlugs.map((slug) => ({
  //   slug,
  // }));
  return [];
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

  const drink = await findBy({ slug });

  if (!drink) {
    throw new Error("no drink " + slug);
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: drink.name,
    description: drink.description,
    twitter: {
      card: "summary_large_image",
      site: "@DrinkGenieApp",
      title: drink.name,
      description: drink.description,
      images: drink.imageUrl ? [drink.imageUrl] : [],
      creator: "DrinkGenie",
    },
    openGraph: {
      images: drink.imageUrl
        ? [drink.imageUrl, ...previousImages]
        : previousImages,
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

  const drink = await findBy({ slug });

  if (!drink) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Drinks", path: "/" },
    { label: drink.name },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <ViewRegister drinkId={drink.id} />

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Section */}
        {drink.imageUrl ? (
          <DrinkDetailImage drink={drink} />
        ) : (
          <PollingImageFetcher drinkId={drink.id} />
        )}

        <div className="p-8">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: <Clock />,
                label: "Prep Time",
                value: drink.preparationTime || "5 mins",
              },
              {
                icon: <ChefHat />,
                label: "Difficulty",
                value: drink.difficulty || "Easy",
              },
              {
                icon: <GlassWater />,
                label: "Glass",
                value: drink.glassType || "Cocktail Glass",
              },
              {
                icon: <Flower2 />,
                label: "Garnish",
                value: drink.garnish || "Lime Wheel",
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="text-center p-4 bg-background rounded-xl"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-primary/10">
                  {React.cloneElement(icon, {
                    className: "h-5 w-5 text-primary",
                  })}
                </div>
                <p className="text-sm text-primary/60 mb-1">{label}</p>
                <p className="font-medium text-primary">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-primary/80 mb-8">
            {drink.description ||
              `A delightful blend of ${drink.ingredients.join(", ")}, creating a perfectly balanced 
              cocktail that's sure to impress.`}
          </p>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {drink.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-background rounded-lg text-primary/80"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-sm">
                    {index + 1}
                  </span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-display text-primary mb-4">
              Instructions
            </h2>
            <ol className="space-y-4">
              {drink.preparationSteps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {index + 1}
                  </div>
                  <p className="text-primary/80 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Affiliated Links Section */}
      <AffiliatedLinks ingredients={drink.ingredients} />
    </main>
  );
}
