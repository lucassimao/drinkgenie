import { getBestIdeasListing } from "@/lib/drinks";
import { Drink } from "./drink";

export async function BestIdeasListing() {
  const top5Ideas = await getBestIdeasListing(5);

  return (
    <div className="flex flex-wrap justify-between">
      {top5Ideas.map((drink) => (
        <Drink drink={drink} key={drink.id} />
      ))}
    </div>
  );
}
