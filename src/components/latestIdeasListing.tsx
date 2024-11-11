import { getLatestDrinkIdeas } from "@/lib/drinks";

import { Drink } from "./drink";
import Link from "next/link";

export async function LatestIdeasListing() {
  const latestDrinkIdeas = await getLatestDrinkIdeas(10);

  return (
    <div className="flex flex-wrap justify-between">
      {latestDrinkIdeas.map((drink) => (
        <Link key={drink.id} href={`/drink/${drink.slug}`}>
          <Drink drink={drink} />
        </Link>
      ))}
    </div>
  );
}
