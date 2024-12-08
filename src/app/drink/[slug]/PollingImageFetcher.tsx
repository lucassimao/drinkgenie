"use client";

import { DrinkImageSkeleton } from "@/components/DrinkImageSkeleton";
import { useDrinkImagePoller } from "@/hooks/useDrinkImagePoller";
import { DrinkDetailImage } from "./DrinkDetailImage";

type PollingImageFetcherProps = {
  drinkId: number;
};
export const PollingImageFetcher = ({ drinkId }: PollingImageFetcherProps) => {
  const { updatedDrink } = useDrinkImagePoller(drinkId);

  if (updatedDrink) {
    return <DrinkDetailImage drink={updatedDrink} />;
  }

  return <DrinkImageSkeleton />;
};
