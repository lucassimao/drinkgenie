import { findBy } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import { useEffect, useState } from "react";

export function useDrinkImagePoller(drinkId: number) {
  const [updatedDrink, setUpdatedDrink] = useState<Drink | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function fetchDrink() {
      try {
        console.log("checking");

        const fetchedDrink = await Promise.race([
          findBy({ id: drinkId }),
          new Promise<Drink | null>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout after 5s")), 5000),
          ),
        ]);

        if (fetchedDrink && !fetchedDrink.isGeneratingImage) {
          setUpdatedDrink(fetchedDrink);
        } else {
          timeoutId = setTimeout(fetchDrink, 1_000);
        }
      } catch (error) {
        console.error("Error fetching drink:", error);
      }
    }

    timeoutId = setTimeout(fetchDrink, 1_000);

    return () => {
      console.log("disabling timeout");
      clearTimeout(timeoutId);
    };
  }, [drinkId]);

  return {
    updatedDrink,
  };
}
