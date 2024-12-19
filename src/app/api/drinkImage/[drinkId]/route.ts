import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import { put } from "@vercel/blob";
import { waitUntil } from "@vercel/functions";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import knex from "@/lib/knex";
import { recraftGenerate } from "@/lib/recraft";

export const maxDuration = 60;

async function generateImage(drink: Drink): Promise<void> {
  console.log(`generating image for ${drink.id}`);

  const prompt = `Professional photograph of the ${drink.name} cocktail. ${drink.description}. Preparation steps: ${drink.preparationSteps.join(",")}. Garnished with ${drink.garnish}. Glass type ${drink.glassType}. `;

  // 16:9 aspect ratio
  const buffer = await recraftGenerate(drink.id, prompt, 1820, 1024);

  const blob = new Blob([buffer], { type: "image/jpg" });

  const putResult = await put(slugify(drink.name.toLowerCase()), blob, {
    access: "public",
    addRandomSuffix: true,
  });

  await knex("drinks").where("id", drink.id).update({
    image_url: putResult.url,
    is_generating_image: false,
    width: 1820,
    height: 1024,
  });

  revalidatePath(`/(home)/[[...page]]`, "page");
  revalidatePath(`/drink/${drink.slug}`);

  console.log(`image generated for ${drink.id}!`);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ drinkId: string }> },
) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const drinkId = +(await params).drinkId;

  if (!drinkId)
    return new Response("Bad Request", {
      status: 400,
      statusText: `Invalid drink id: ${drinkId}`,
    });

  const drink = await getDrinks({ id: drinkId });

  if (!drink)
    return new Response("Not Found", {
      status: 400,
      statusText: `drink id: ${drinkId}`,
    });

  waitUntil(generateImage(drink));

  return new Response("ok", {
    status: 200,
  });
}
