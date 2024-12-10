"use server";

import { Drink, ServiceError } from "@/types/drink";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db, QueryResultRow, sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import slugify from "slugify";
import { z } from "zod";
import knex from "./knex";
import { getUserCredits } from "./user";
import { BASE_URL, MAX_INGREDIENTS } from "./utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DrinkRecipeSchema = z.object({
  name: z.string(),
  preparationSteps: z.array(z.string()),
  ingredients: z.array(z.string()),
  description: z.string(),

  preparationTime: z.string(),
  difficulty: z.enum(["Easy", `Medium`, `Hard`]),
  glassType: z.string(),
  garnish: z.string(),
});

type DrinkRecipe = z.infer<typeof DrinkRecipeSchema>;

export async function countDrinks(
  ingredient?: string,
  difficulty?: string,
): Promise<number> {
  const queryBuilder = knex("drinks as d").count("d.id");

  if (ingredient) {
    queryBuilder.whereRaw(`array_to_string(d.ingredients, ',') ILIKE ?`, [
      `%${ingredient}%`,
    ]);
  }

  if (difficulty) {
    queryBuilder.where("difficulty", difficulty);
  }

  const { sql, bindings } = queryBuilder.toSQL().toNative();

  const client = await db.connect();

  //eslint-disable-next-line
  const { rows } = await client.query(sql, bindings as any);
  return +rows[0].count;
}

function mapRowToDrink(row: QueryResultRow): Drink {
  return {
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at),
    description: row.description,
    imageUrl: row.image_url,
    ingredients: row.ingredients,
    preparationSteps: row.preparation_steps,
    slug: row.slug,
    userId: row.user_id,
    isFavorite: row.is_favorite,
    creator: row.creator,
    difficulty: row.difficulty,
    glassType: row.glass_type,
    isGeneratingImage: row.is_generating_image,
    preparationTime: row.preparation_time,
    garnish: row.garnish,
    views: row.views,
  };
}

function serializeArray(arr: string[]): string {
  return `{${arr.map((item) => `"${item.replace(/"/g, '\\"')}"`).join(",")}}`;
}

type CreateDrinkDTO = Pick<
  Drink,
  | "description"
  | "ingredients"
  | "name"
  | "preparationSteps"
  | "isGeneratingImage"
  | "difficulty"
  | "garnish"
  | "glassType"
  | "preparationTime"
  | "creator"
>;

async function saveDrink(dto: CreateDrinkDTO): Promise<Drink> {
  const slug = slugify(dto.name.toLowerCase());

  const user = await currentUser();

  if (!user) {
    throw new Error("You must be signed in to use this feature");
  }

  const { rows } = await sql`
      WITH slug_check AS (
        SELECT EXISTS (SELECT 1 FROM drinks WHERE slug = ${slug}) AS exists
      )
      INSERT INTO DRINKS (user_id,creator,slug, name,created_at,difficulty,garnish,glass_type,preparation_time,description,is_generating_image,ingredients,thumbs_up, thumbs_down,preparation_steps) 
        VALUES (
        ${user.id},
        ${JSON.stringify(user)},
        (SELECT CASE WHEN exists THEN ${slug} || '-' || to_char(now(), 'YYYYMMDDHH24MISS') ELSE ${slug} END FROM slug_check),
        ${dto.name},
        NOW(), ${dto.difficulty},${dto.garnish},${dto.glassType},${dto.preparationTime},
        ${dto.description},${dto.isGeneratingImage},
        ${serializeArray(dto.ingredients)},0,0, ${serializeArray(dto.preparationSteps)}) 
      RETURNING *;
    `;

  return mapRowToDrink(rows[0]);
}

type FindByArgs = {
  id?: number;
  slug?: string;
  page?: number;
  pageSize?: number;
  ingredient?: string | null;
  loggedInUserId?: string | null; // logged in requesting drinks
  difficulty?: string | null;
  keyword?: string | null;
  sortBy?:
    | "latest"
    | "relevance"
    | "popular"
    | "rating"
    | "quick"
    | "ingredients";
  alcoholContent?: string[];
  flavorProfile?: string[];
  glassware?: string[];
  temperature?: string[];
};

export async function findBy(
  args: FindByArgs & { id: number },
): Promise<Drink | null>;
export async function findBy(
  args: FindByArgs & { slug: string },
): Promise<Drink | null>;
export async function findBy(
  args: Omit<FindByArgs, "id" | "slug">,
): Promise<Drink[]>;
export async function findBy(): Promise<Drink[]>;
export async function findBy(
  args?: FindByArgs,
): Promise<Drink | null | Drink[]> {
  const queryBuilder = knex<Drink>("drinks as d").select("d.*");

  switch (args?.sortBy) {
    case "ingredients":
      queryBuilder.orderByRaw(
        "array_length(ingredients, 1) ASC, d.created_at DESC",
      );
      break;
    case "latest":
      queryBuilder.orderBy("d.created_at", "desc");
      break;
    case "popular":
      queryBuilder.orderBy("d.views", "desc");
      break;
    case "quick":
      queryBuilder.orderByRaw(
        "CAST(regexp_replace(preparation_time, '[^0-9]', '', 'g') AS INTEGER) ASC",
      );
      break;
    case "rating":
      queryBuilder
        .leftJoin("favorites", "d.id", "favorites.drink_id")
        .select(knex.raw("COUNT(favorites.id) as favorite_count"))
        .groupBy("d.id")
        .orderBy("favorite_count", "desc");
      break;
  }

  if (typeof args?.page == "number" && typeof args?.pageSize == "number") {
    const offset = (args.page - 1) * args.pageSize;

    queryBuilder.offset(offset).limit(args.pageSize);
  }

  if (args?.difficulty) {
    queryBuilder.where("difficulty", args.difficulty);
  }

  if (args?.keyword?.trim()) {
    const keyword = args.keyword?.trim();
    queryBuilder.whereRaw(
      `d.name||d.description||garnish ilike '%${keyword}%'`,
    );
  }

  // fetching votes made by the current user
  if (typeof args?.loggedInUserId == `number`) {
    queryBuilder
      .leftJoin("favorites AS fav", function () {
        this.on("d.id", "=", "fav.drink_id").andOn(
          knex.raw("fav.user_id = ?", args.loggedInUserId!),
        );
      })
      .select(
        knex.raw(
          "CASE WHEN fav.id IS NOT NULL THEN true ELSE false END AS is_favorite",
        ),
      );
  }

  if (args?.ingredient) {
    queryBuilder.whereRaw(`array_to_string(d.ingredients, ',') ILIKE ?`, [
      `%${args.ingredient}%`,
    ]);
  }

  if (args?.id) {
    queryBuilder.where("id", args.id).first();
  }

  if (args?.slug) {
    queryBuilder.where("slug", args.slug).first();
  }

  if (args?.alcoholContent?.length) {
    queryBuilder.whereRaw("alcohol_content = ANY(?)", [args.alcoholContent]);
  }

  if (args?.flavorProfile?.length) {
    queryBuilder.whereRaw("flavor_profile = ANY(?)", [args.flavorProfile]);
  }

  if (args?.glassware?.length) {
    queryBuilder.whereRaw("glassware = ANY(?)", [args.glassware]);
  }

  if (args?.temperature?.length) {
    queryBuilder.whereRaw("temperature = ANY(?)", [args.temperature]);
  }

  const { sql, bindings } = queryBuilder.toSQL().toNative();
  const client = await db.connect();

  //eslint-disable-next-line
  const { rows } = await client.query(sql, bindings as any);
  const result = rows.map(mapRowToDrink);

  const returnFirst = args?.id || args?.slug;

  if (returnFirst) {
    return result[0];
  } else {
    return result;
  }
}

export async function incrementViews(drinkId: number): Promise<void> {
  await sql`UPDATE drinks SET views = views+1 WHERE id=${drinkId};`;
}

export async function getSlugsForSSR(): Promise<string[]> {
  const { rows } =
    await sql`SELECT slug from DRINKS WHERE image_url IS NOT NULL;`;
  return rows.map((row) => row.slug);
}

export async function toggleFavorite(drinkId: number): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new ServiceError("You must be signed in to favorite.");
  }

  const { rows } =
    await sql`INSERT INTO favorites(user_id,drink_id) VALUES(${userId},${drinkId}) ON CONFLICT (user_id,drink_id) DO NOTHING RETURNING ID`;

  // on conflict triggered
  if (rows.length == 0) {
    await sql`DELETE FROM favorites WHERE user_id=${userId} AND drink_id=${drinkId}`;
  }
}

export async function generateDrink(ingredients: string[]): Promise<Drink> {
  const user = await currentUser();

  if (!user) {
    throw new ServiceError("You need to authenticate first.");
  }

  const userId = user?.id;

  const userCredits = await getUserCredits(userId);
  if (userCredits <= 0) {
    throw new ServiceError("No enough credits.");
  }

  if (!Array.isArray(ingredients) || ingredients.length == 0) {
    throw new ServiceError(`List up to ${MAX_INGREDIENTS} ingredients.`);
  }

  if (ingredients.length > MAX_INGREDIENTS) {
    throw new ServiceError("Too many ingredients!");
  }

  try {
    console.time("openai");

    const completion = await openai.beta.chat.completions.parse({
      model: `gpt-4o-mini`, //"gpt-4o",
      user: userId,
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: `
              You are an expert mixologist with 20+ years of experience crafting cocktails in high-end establishments worldwide. 
              You have an encyclopedic knowledge of classical and modern cocktails, deep understanding of flavor profiles, and a
              passion for helping people discover the perfect drink. 

              When presented with ingredients, you will:

              INITIAL ANALYSIS:

                - First scan the ingredients to understand available flavor profiles
                - Consider classic and modern cocktails that could be made
                - Think about possible variations or substitutions
                - Take into account seasonal relevance
              
              SUGGEST A DRINK:
                For each drink, provide:
                - Name of the cocktail
                - Full list of ingredients (only names, no measurements) 
                - Step-by-step preparation instructions with exact measurements (both ml/oz and common bar measurements)
                - Rich description
                - Garnish details
                - Glassware recommendation
                - Difficulty level (Easy, Medium, or Hard)
                - Preparation time (minutes)

              Your response should be:
                - Professional yet approachable
                - Rich in practical details
                - Educational but not overwhelming
                - Engaging and conversational
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
                difficulty: "Easy",
                glassType: "Lowball glass",
                preparationTime: "10 mins",
                garnish: "Lime wedges",
              } as DrinkRecipe),
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `I have the following ingredients at home: ${ingredients.join(",")}. Could you please suggest a cocktail that I can prepare?`,
            },
          ],
        },
      ],
      response_format: zodResponseFormat(DrinkRecipeSchema, "recipe"),
    });
    console.timeEnd("openai");

    if (!completion?.choices?.[0]?.message) {
      throw new ServiceError("Sorry, we ran out of ideas for now.");
    }

    const recipe = completion.choices[0].message;

    if (recipe.refusal) {
      console.warn(`[REFUSAL] ingredients ${ingredients}: ${recipe.refusal}`);
      throw new ServiceError("Oops! Something went wrong. Please try again.");
    }

    if (!recipe.parsed) {
      throw new ServiceError("Sorry, we ran out of ideas for now.");
    }

    console.time("saveDrink");
    const drink = await saveDrink({
      name: recipe.parsed.name,
      preparationSteps: recipe.parsed.preparationSteps,
      description: recipe.parsed.description,
      ingredients: recipe.parsed.ingredients,
      isGeneratingImage: true,
      creator: user,
      difficulty: recipe.parsed.difficulty,
      glassType: recipe.parsed.glassType,
      preparationTime: recipe.parsed.preparationTime,
      garnish: recipe.parsed.garnish,
    });
    console.timeEnd("saveDrink");

    // endpoint will return 200 immediatly. The long running operation will keep running
    const res = await fetch(`${BASE_URL}/api/drinkImage/${drink.id}`, {
      method: "POST",
    });

    if (!res.ok) {
      console.error(
        `failed to trigger drink #${drink.id} image generation: ${res.status} ${res.statusText}`,
      );
    }

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
  throw new ServiceError("Sorry, we ran out of ideas for now.");
}

export async function getNextDrinkToShare(
  network: "twitter" | "facebook",
): Promise<Drink | null> {
  let result = null;

  if (network == "twitter") {
    result =
      await sql`SELECT * FROM drinks WHERE tweet_posted_at IS NULL AND image_url IS NOT NULL ORDER BY ID DESC LIMIT 1`;
  } else if (network == "facebook") {
    result =
      await sql`SELECT * FROM drinks WHERE facebook_posted_at IS NULL AND image_url IS NOT NULL ORDER BY ID DESC LIMIT 1`;
  } else {
    throw new Error("Invalid network: " + network);
  }

  if (result.rowCount == 0) return null;

  return mapRowToDrink(result.rows[0]);
}
