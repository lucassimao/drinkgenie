import { ParsedUrlQuery } from "querystring";

import { AffiliatedLinks } from "@/components/AffiliatedLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDrinks, getSlugsForSSR } from "@/lib/drinks";
import {
  ChefHat,
  Clock,
  Flower2,
  GlassWater,
  Lock,
  Sparkles,
} from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { DrinkDetailImage } from "./DrinkDetailImage";
import { PollingImageFetcher } from "./PollingImageFetcher";
import { ViewRegister } from "./ViewRegister";
import { RecipeSchema } from "@/components/RecipeSchema";
import Link from "next/link";

interface DrinkDetailProps {
  params: Promise<ParsedUrlQuery>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await getSlugsForSSR();
  return slugs.map((slug) => ({ slug }));
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

  const drink = await getDrinks({ slug });

  if (!drink) {
    throw new Error("no drink " + slug);
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = parent ? (await parent).openGraph?.images || [] : [];

  const images: string[] = [];
  if (drink.twitterSummaryLargeImage) {
    images.push(drink.twitterSummaryLargeImage);
  } else if (drink.imageUrl) {
    images.push(drink.imageUrl);
  }

  return {
    title: drink.name,
    description: drink.description,
    twitter: {
      card: "summary_large_image",
      site: "@DrinkGenieApp",
      title: drink.name,
      description: drink.description,
      images,
      creator: "DrinkGenie",
    },
    openGraph: {
      images:
        images?.length > 0 ? [...images, ...previousImages] : previousImages,
      siteName: "DrinkGenie",
      url: `https://www.drinkgenie.app/drink/${slug}`,
    },
  };
}

export default async function DrinkDetail({ params }: DrinkDetailProps) {
  const slug = (await params).slug as string;

  if (!slug) {
    notFound();
  }

  const drink = await getDrinks({ slug });

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
      <RecipeSchema drink={drink} />
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
            <ul className="space-y-4">
              {drink.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex flex-col">
                  <div className="p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3 text-primary/80 mb-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-sm">
                        {index + 1}
                      </span>
                      {ingredient}
                    </div>
                    {(ingredient.toLowerCase().includes("juice") ||
                      index === 0) && (
                      <p className="ml-9 text-sm text-primary/70">
                        {ingredient.toLowerCase().includes("juice")
                          ? "Fresh juice adds bright, natural flavors and essential vitamins to your cocktail."
                          : `${ingredient} is a key component that adds depth and character to this drink.`}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Instructions
            </h2>
            <ol className="space-y-4">
              {drink.preparationSteps?.map((step, index) => {
                // Replace measurement patterns (e.g., "30 ml", "2 oz", "1/2 cup") with a lock icon
                const stepWithLockedMeasurements = step.replace(
                  /(\d+\/?\d*\s*(ml|oz|cup|tbsp|tsp|dash|shot))/gi,
                  (match) => `<lock>${match}</lock>`,
                );

                const parts =
                  stepWithLockedMeasurements.split(/<lock>|<\/lock>/);

                return (
                  <li key={index} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {index + 1}
                    </div>
                    <p className="text-primary/80 pt-1">
                      {parts.map((part, i) =>
                        i % 2 === 0 ? (
                          part
                        ) : (
                          <span
                            key={i}
                            className="relative inline-flex items-center group"
                          >
                            <Lock className="h-5 w-5 text-accent/90 mx-1" />
                            <span className="sr-only">{part}</span>
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-primary/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Exact measurements and amounts available for
                              subscribers
                            </span>
                          </span>
                        ),
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Drink Curiosities */}
          <div className="mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Fun Facts & Curiosities
            </h2>
            <div className="grid gap-4">
              <div className="p-4 bg-background rounded-lg border border-primary/10">
                <h3 className="text-lg font-medium text-primary mb-2">
                  Historical Origins
                </h3>
                <p className="text-primary/80">
                  {drink.name.toLowerCase().includes("martini")
                    ? "The Martini's origin is disputed between several cities, but it became an icon of sophistication in the 1950s thanks to James Bond!"
                    : drink.name.toLowerCase().includes("mojito")
                      ? "The Mojito was born in Havana, Cuba, and was allegedly a favorite of Ernest Hemingway!"
                      : `The ${drink.name} represents a perfect blend of classic mixology and modern innovation.`}
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border border-primary/10">
                <h3 className="text-lg font-medium text-primary mb-2">
                  Did You Know?
                </h3>
                <p className="text-primary/80">
                  {drink.ingredients.some((i) =>
                    i.toLowerCase().includes("juice"),
                  )
                    ? "Fresh citrus juice can lose its vibrant flavor within 4-6 hours - that's why drinks taste better when made with freshly squeezed juice!"
                    : drink.ingredients.some((i) =>
                          i.toLowerCase().includes("gin"),
                        )
                      ? "Gin's primary flavoring, juniper berries, take two years to mature before they can be harvested!"
                      : "The art of cocktail making dates back to the early 1800s, when the first cocktail was defined as a mixture of spirits, sugar, water, and bitters."}
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border border-primary/10">
                <h3 className="text-lg font-medium text-primary mb-2">
                  Fun Serving Tradition
                </h3>
                <p className="text-primary/80">
                  {drink.glassType?.toLowerCase().includes("martini")
                    ? "The iconic V-shaped martini glass was designed during prohibition to make it easy to quickly dispose of the drink if needed!"
                    : drink.glassType?.toLowerCase().includes("copper")
                      ? "Copper mugs aren't just for show - they actually help keep your drink colder for longer and enhance its taste!"
                      : "The type of glass used can significantly impact your drinking experience by affecting temperature, aroma concentration, and even how the flavors hit your palate."}
                </p>
              </div>
            </div>
          </div>

          {/* Allergen Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Common Allergens & Allergy Information
            </h2>
            <div className="relative p-6 bg-background rounded-lg text-center">
              <Lock className="mx-auto h-8 w-8 text-primary/40 mb-2" />
              <p className="text-primary/80 mb-4">
                Get detailed allergen information and safety details with our
                premium features
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent to-warning text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5" />
                <span>Unlock Premium Access</span>
              </Link>
            </div>
          </div>

          {/* Temperature-sensitive ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Temperature-sensitive ingredients
            </h2>
            <div className="relative p-6 bg-background rounded-lg text-center">
              <Lock className="mx-auto h-8 w-8 text-primary/40 mb-2" />
              <p className="text-primary/80 mb-4">
                Learn about ingredient temperature requirements and storage tips
                with our premium features
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent to-warning text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5" />
                <span>Unlock Premium Access</span>
              </Link>
            </div>
          </div>

          {/* Food Pairing Recommendations */}
          <div className="mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Food Pairing Recommendations
            </h2>
            <div className="relative p-6 bg-background rounded-lg text-center">
              <Lock className="mx-auto h-8 w-8 text-primary/40 mb-2" />
              <p className="text-primary/80 mb-4">
                Discover expert food pairing suggestions to enhance your drink
                experience
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent to-warning text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5" />
                <span>Unlock Premium Access</span>
              </Link>
            </div>
          </div>

          {/* Photography Tips */}
          <div className="mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Photography Tips for Social Media
            </h2>
            <div className="relative p-6 bg-background rounded-lg text-center">
              <Lock className="mx-auto h-8 w-8 text-primary/40 mb-2" />
              <p className="text-primary/80 mb-4">
                Learn professional techniques to capture stunning drink photos
                for your social media
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent to-warning text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5" />
                <span>Unlock Premium Access</span>
              </Link>
            </div>
          </div>

          {/* Garnish Placement */}
          <div className="mb-8">
            <h2 className="text-2xl font-display text-primary mb-4">
              Garnish Placement Guide
            </h2>
            <div className="relative p-6 bg-background rounded-lg text-center">
              <Lock className="mx-auto h-8 w-8 text-primary/40 mb-2" />
              <p className="text-primary/80 mb-4">
                Learn expert techniques for perfect garnish placement and
                presentation
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent to-warning text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5" />
                <span>Unlock Premium Access</span>
              </Link>
            </div>
          </div>

          {/* Affiliated Links Section */}
          <AffiliatedLinks ingredients={drink.ingredients} />
        </div>
      </div>
    </main>
  );
}
