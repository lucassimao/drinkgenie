import { Drink } from "@/types/drink";
import React from "react";

type RecipeSchemaProps = {
  drink: Drink;
};

export function RecipeSchema({ drink }: RecipeSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    name: drink.name,
    image: [drink.twitterSummaryLargeImage, drink.imageUrl].filter(Boolean), // filter out twitterSummaryLargeImage if not present
    description: drink.description,
    prepTime: `PT${drink.preparationTime}`,
    thumbnailUrl: drink.imageUrl,
    recipeIngredient: drink.ingredients,
    recipeInstructions: drink.preparationSteps.map((step) => ({
      "@type": "HowToStep",
      text: step,
    })),
    // aggregateRating: recipe.rating && {
    //   "@type": "AggregateRating",
    //   ratingValue: recipe.rating.value,
    //   reviewCount: recipe.rating.count,
    // },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
