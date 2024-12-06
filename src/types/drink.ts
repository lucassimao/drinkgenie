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
  thumbsUp: number;
  thumbsDown: number;
  slug: string;
  userId: string;
  isFavorite: boolean; // derived from favorite table. if the logged in user favorited this drink

  isGeneratingImage: boolean;
  creator: User;
  preparationTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  glassType: string;
  garnish?: string | null;
};

export class ServiceError extends Error {}
