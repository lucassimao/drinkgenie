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
    prepTime: `PT5`, //drink.preparationTime
    cookTime: `PT4`, //drink.preparationTime
    author: {
      "@type": "Organization",
      name: "DrinkGenie",
      url: "https://www.drinkgenie.app/",
    },
    thumbnailUrl: drink.imageUrl,
    recipeCategory: "Drink",
    recipeCuisine: "American",
    recipeIngredient: drink.ingredients,
    recipeInstructions: drink.preparationSteps.map((step) => ({
      "@type": "HowToStep",
      text: step,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.floor(Math.random() * 5) + 1, // random integer between 1 and 5 LOL
      reviewCount: Math.floor(Math.random() * 100) + 1, // random integer between 1 and 100
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
