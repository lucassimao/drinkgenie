import { getDrinks } from "@/lib/drinks";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const drinks = await getDrinks();

  const items: MetadataRoute.Sitemap = drinks.map((drink) => ({
    url: `https://www.drinkgenie.app/drink/${drink.slug}`,
    lastModified: drink.createdAt,
    changeFrequency: "daily",
    priority: 0.7,
    images: [drink.imageUrl, drink.twitterSummaryLargeImage].filter(
      (s) => typeof s == "string",
    ),
  }));

  items.push({
    url: `https://www.drinkgenie.app/`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 1,
  });

  return items;
}
