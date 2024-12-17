import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import { put } from "@vercel/blob";
import { waitUntil } from "@vercel/functions";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import knex from "@/lib/knex";

async function generateImage(drink: Drink): Promise<void> {
  console.log(`generating image for ${drink.id}`);

  const response = await fetch(
    "https://external.api.recraft.ai/v1/images/generations",
    {
      method: "POST",
      headers: {
        Authorization: process.env.RECRAFT_API_key || "",
      },
      body: JSON.stringify({
        style: "realistic_image",
        response_format: "b64_json",
        size: "1024x1024",
        model: "recraftv3",
        prompt: `Professional photograph of the ${drink.name} cocktail. ${drink.description}. Garnished with ${drink.garnish}. Glass type ${drink.glassType}. Preparation steps: ${drink.preparationSteps.join(",")} `,
      }),
    },
  );

  if (!response.ok) {
    const { status, statusText } = response;
    throw new Error(
      `failed to generate image for ${drink.name}:  ${status} ${statusText}`,
    );
  }

  const result = await response.json();
  if (!result?.data?.length || typeof result.data[0].b64_json != "string") {
    throw new Error(
      `No data nor b64_json for ${drink.name}. result: ${JSON.stringify(result)}`,
    );
  }

  const binaryData = Uint8Array.from(atob(result.data[0].b64_json), (char) =>
    char.charCodeAt(0),
  );

  const blob = new Blob([binaryData], { type: "image/jpg" });

  const putResult = await put(slugify(drink.name.toLowerCase()), blob, {
    access: "public",
    addRandomSuffix: true,
  });

  await knex("drinks").where("id", drink.id).update({
    image_url: putResult.url,
    is_generating_image: false,
  });

  revalidatePath(`/(home)/[[...page]]`, "page");
  revalidatePath(`/drink/${drink.slug}`);

  console.log(`image generated for ${drink.id}!`);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ drinkId: string }> },
) {
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
