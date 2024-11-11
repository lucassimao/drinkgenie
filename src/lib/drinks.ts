"use server";
import { QueryResultRow, sql } from "@vercel/postgres";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { put } from "@vercel/blob";
import slugify from "slugify";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type Drink = {
  id: number;
  name: string;
  createdAt: Date;
  description: string;
  imageUrl: string;
  ingredients: string[];
  preparationSteps: string[];
  thumbsUp: number;
  thumbsDown: number;
  slug: string;
  userId: string;
  userProfileImageUrl: string;
};

const DrinkRecipeSchema = z.object({
  name: z.string(),
  preparationSteps: z.array(z.string()),
  ingredients: z.array(z.string()),
  description: z.string(),
});

type DrinkRecipe = z.infer<typeof DrinkRecipeSchema>;

type User = { id: string; imageUrl: string };

export async function getLatestDrinkIdeas(n: number): Promise<Drink[]> {
  const { rows } =
    await sql`SELECT * from DRINKS ORDER BY created_at DESC LIMIT ${n};`;
  return rows.map(mapRowToDrink);
}

function mapRowToDrink(row: QueryResultRow): Drink {
  return {
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at),
    description: row.description,
    imageUrl: row.image_url,
    ingredients: row.ingredients,
    thumbsUp: row.thumbs_up,
    thumbsDown: row.thumbs_down,
    preparationSteps: row.preparation_steps,
    slug: row.slug,
    userId: row.user_id,
    userProfileImageUrl: row.user_profile_image_url,
  };
}

function serializeArray(arr: string[]): string {
  return `{${arr.map((item) => `"${item.replace(/"/g, '\\"')}"`).join(",")}}`;
}

async function saveDrink(
  user: User,
  dto: Pick<
    Drink,
    "description" | "imageUrl" | "ingredients" | "name" | "preparationSteps"
  >,
): Promise<Drink> {
  const slug = slugify(dto.name.toLowerCase());

  const { rows } = await sql`
      WITH slug_check AS (
        SELECT EXISTS (SELECT 1 FROM drinks WHERE slug = ${slug}) AS exists
      )
      INSERT INTO DRINKS (user_id,user_profile_image_url,slug, name,created_at,description,image_url,ingredients,thumbs_up, thumbs_down,preparation_steps) 
        VALUES (
        ${user.id},
        ${user.imageUrl},
        (SELECT CASE WHEN exists THEN ${slug} || '-' || to_char(now(), 'YYYYMMDDHH24MISS') ELSE ${slug} END FROM slug_check),
        ${dto.name},NOW(), ${dto.description}, ${dto.imageUrl},${serializeArray(dto.ingredients)},0,0, ${serializeArray(dto.preparationSteps)}) 
      RETURNING *;
    `;

  return mapRowToDrink(rows[0]);
}

export async function getBestIdeasListing(n: number): Promise<Drink[]> {
  const { rows } =
    await sql`SELECT * from DRINKS ORDER BY thumbs_up DESC, created_at DESC LIMIT ${n};`;

  return rows.map(mapRowToDrink);
}

export async function getDrinkBySlug(slug: string): Promise<Drink | null> {
  const { rows } = await sql`SELECT * from DRINKS where slug=${slug} LIMIT 1;`;
  return mapRowToDrink(rows[0]);
}

async function vote(drinkId: number, type: "up" | "down"): Promise<void> {
  if (type == "up") {
    await sql`UPDATE DRINKS SET thumbs_up = thumbs_up + 1  WHERE id = ${drinkId};`;
  } else {
    await sql`UPDATE DRINKS SET thumbs_down = thumbs_down + 1  WHERE id = ${drinkId};`;
  }
}

export async function thumbsUp(previousState: number, formData: FormData) {
  const drinkId = formData.get("drinkId");
  if (!drinkId) {
    throw new Error("no drink");
  }

  await vote(+drinkId, "up");
  return previousState + 1;
}

export async function thumbsDown(previousState: number, formData: FormData) {
  const drinkId = formData.get("drinkId");
  if (!drinkId) {
    throw new Error("no drink");
  }

  await vote(+drinkId, "down");
  // optmistically increasing by 1
  return previousState + 1;
}

export async function generateIdea(
  user: User,
  ingredients: string,
): Promise<Drink | string> {
  if (ingredients.length > 100) {
    return "Too many ingredients!";
  }

  if (typeof ingredients != "string" || ingredients.split(",").length < 3) {
    return "List at least 3 ingredients.";
  }

  if (!user) {
    return "You need to authenticate first.";
  }

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      user: user.id,
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: `
              You are a helpful, skilled, and creative barman that when given a list of ingredients can then
              suggest famous drinks and cocktails, including the preparation steps (including measurements), a short 
              description and the list of ingredients (just names, no measurements).
            `,
            },
          ],
        },
        {
          role: "assistant",
          content: [
            {
              type: "text",
              text: JSON.stringify({
                ingredients: ["Cachaça", "Lemon", "Ice", "Sugar"],
                name: "Caipirinha",
                preparationSteps: [
                  "Juice 3 limes",
                  "Cut the other 2 limes in 8 parts each",
                  "Add the cut limes, and 3 tablespoons of sugar to the cup and muddle",
                  "Add the lime juice and 3/4 cup of cachaça and stir gently",
                  "Add ice to 2 glasses and fill them with caipirinha",
                ],
                description: "The word-famous brazilian drink.",
              } as DrinkRecipe),
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `I have the following ingredients at home: ${ingredients}. Give me a suggestion of a cocktail that I can prepare.`,
            },
          ],
        },
      ],
      response_format: zodResponseFormat(DrinkRecipeSchema, "recipe"),
    });

    if (!completion?.choices?.[0]?.message) {
      return "Sorry, we ran out of ideas for now.";
    }

    const recipe = completion.choices[0].message;

    if (recipe.refusal) {
      console.warn(`[REFUSAL] ingredients ${ingredients}: ${recipe.refusal}`);
      return "Oops! Something went wrong. Please try again.";
    }

    if (!recipe.parsed) {
      return "Sorry, we ran out of ideas for now.";
    }

    const imageUrl = await generateImage(recipe.parsed);

    if (!imageUrl) {
      return "Oops! Something went wrong. Please try again.";
    }

    const drink = await saveDrink(user, {
      name: recipe.parsed.name,
      preparationSteps: recipe.parsed.preparationSteps,
      description: recipe.parsed.description,
      imageUrl,
      ingredients: recipe.parsed.ingredients,
    });

    revalidatePath("/");

    return drink;

    // eslint-disable-next-line
  } catch (e: any) {
    if (e.constructor.name == "LengthFinishReasonError") {
      console.log("Too many tokens: ", e.message);
    } else {
      console.log("An error occurred: ", e.message);
    }
  }
  return "Sorry, we ran out of ideas for now.";
}

async function generateImage(drink: DrinkRecipe): Promise<string | null> {
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
    console.error(
      `failed to generate image for ${drink.name}:  ${status} ${statusText}`,
    );
    return null;
  }

  const result = await response.json();
  if (!result?.data?.length || typeof result.data[0].b64_json != "string") {
    console.error(
      `No data nor b64_json for ${drink.name}. result: ${JSON.stringify(result)}`,
    );
    return null;
  }

  const binaryData = Uint8Array.from(atob(result.data[0].b64_json), (char) =>
    char.charCodeAt(0),
  );

  const blob = new Blob([binaryData], { type: "image/jpg" });

  const putResult = await put(slugify(drink.name.toLowerCase()), blob, {
    access: "public",
    addRandomSuffix: true,
  });

  return putResult.url;
}
