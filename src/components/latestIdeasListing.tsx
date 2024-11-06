import { getLatestDrinkIdeas } from "@/lib/drinks";

import { Drink } from "./drink";

export async function LatestIdeasListing() {
  const latestDrinkIdeas = await getLatestDrinkIdeas(5);

  return (
    <div className="flex flex-wrap justify-between">
      {latestDrinkIdeas.map((drink) => (
        <Drink drink={drink} key={drink.id} />
      ))}
    </div>
  );
}
