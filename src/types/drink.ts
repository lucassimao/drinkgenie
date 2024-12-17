import { User } from "@clerk/nextjs/server";

export type DrinkFormData = {
  ingredients: string[];
};

export type Drink = {
  id: number;
  name: string;
  createdAt: Date;
  description: string;
  imageUrl?: string | null;
  ingredients: string[];
  preparationSteps: string[];
  slug: string;
  userId: string;
  isFavorite: boolean; // derived from favorite table. if the logged in user favorited this drink

  isGeneratingImage: boolean;
  creator: User;
  preparationTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  glassType: string;
  garnish?: string | null;
  views: number;

  alcoholContent?: "non_alcoholic" | "light" | "medium" | "strong";
  flavorProfile?: "sweet" | "sour" | "bitter" | "spicy";
  glassware?: "cocktail" | "highball" | "rocks" | "wine";
  temperature?: "frozen" | "cold" | "room" | "hot";

  width: number;
  height: number;
};
