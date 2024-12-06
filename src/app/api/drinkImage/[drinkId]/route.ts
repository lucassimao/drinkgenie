import { findBy } from "@/lib/drinks";
import { waitUntil } from "@vercel/functions";
import slugify from "slugify";
import { put } from "@vercel/blob";
import { Drink } from "@/types/drink";
import { sql } from "@vercel/postgres";

async function generateImage(drink: Drink): Promise<void> {
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
        prompt: `Portrait the cocktail ${drink.name}. ${drink.description}. Here are the steps to preprair it: ${drink.preparationSteps.join()} `,
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

  await sql`UPDATE drinks SET image_url = ${putResult.url}, is_generating_image=false WHERE id=${drink.id}`;
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

  const drink = await findBy({ id: drinkId });

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
