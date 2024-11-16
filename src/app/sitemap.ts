import { getAllDrinks } from "@/lib/drinks";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const drinks = await getAllDrinks();

  const items: MetadataRoute.Sitemap = drinks.map((drink) => ({
    url: `https://drinkgenie.app/drink/${drink.slug}`,
    lastModified: drink.createdAt,
    changeFrequency: "daily",
    priority: 0.7,
    images: [drink.imageUrl],
  }));

  items.push({
    url: `https://drinkgenie.app/`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 1,
  });

  return items;
}
