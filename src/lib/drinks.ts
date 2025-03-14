"use server";

import { Drink } from "@/types/drink";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import slugify from "slugify";
import { z } from "zod";
import knex from "./knex";
import { trackSearch } from "./redis";
import { BASE_URL, MAX_INGREDIENTS } from "./utils";
import { checkSubscription } from "./actions";

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

  alcoholContent: z.enum(["non_alcoholic", `light`, `medium`, "strong"]),
  flavorProfile: z.enum(["sweet", "sour", "bitter", "spicy"]),
  glassware: z.enum(["cocktail", "highball", "rocks", "wine"]),
  temperature: z.enum(["frozen", "cold", "room", "hot"]),
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

  const result = await queryBuilder;
  return +result[0].count;
}

//eslint-disable-next-line
function mapRowToDrink(row: Record<string, any>): DrinkWithTotal {
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
    alcoholContent: row.alcohol_content,
    flavorProfile: row.flavor_profile,
    glassware: row.glassware,
    temperature: row.temperature,
    width: row.width,
    height: row.height,
    twitterSummaryLargeImage: row.twitter_summary_large_image,
    totalDrinks: row.total_drinks,
  };
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
  | "alcoholContent"
  | "glassware"
  | "flavorProfile"
  | "temperature"
>;

async function saveDrink(dto: CreateDrinkDTO): Promise<Drink | string> {
  const slug = slugify(dto.name.toLowerCase());

  const { rows } = await knex.raw(
    `
    WITH slug_check AS (
      SELECT EXISTS (SELECT 1 FROM drinks WHERE slug = ?) AS exists
    )
    INSERT INTO DRINKS (
      alcohol_content,
      glassware,
      flavor_profile,
      temperature,
      user_id,
      creator,
      slug,
      name,
      created_at,
      difficulty,
      garnish,
      glass_type,
      preparation_time,
      description,
      is_generating_image,
      ingredients,
      thumbs_up,
      thumbs_down,
      preparation_steps
    )
    VALUES (
      ?,?,?,?,
      ?,
      ?,
      (SELECT CASE 
        WHEN exists THEN ? || '-' || to_char(now(), 'YYYYMMDDHH24MISS') 
        ELSE ? 
      END FROM slug_check),
      ?,
      NOW(),
      ?,?,?,?,
      ?,?,
      ?,
      0,0,
      ?
    )
    RETURNING *;
  `,
    [
      slug,
      // Values in order
      dto.alcoholContent,
      dto.glassware,
      dto.flavorProfile,
      dto.temperature,
      dto.creator.id,
      JSON.stringify(dto.creator),
      slug, // For the CASE WHEN
      slug, // For the ELSE
      dto.name,
      dto.difficulty,
      dto.garnish,
      dto.glassType,
      dto.preparationTime,
      dto.description,
      dto.isGeneratingImage,
      dto.ingredients,
      dto.preparationSteps,
    ],
  );

  return mapRowToDrink(rows[0]);
}

type FindByArgs = {
  id?: number;
  slug?: string;
  page?: number;
  pageSize?: number;
  ingredient?: string | null;
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
  withTotalDrinks?: boolean;
};

export type DrinkWithTotal = Drink & { totalDrinks: number };

export async function getDrinks(
  args: FindByArgs & { withTotalDrinks: true },
): Promise<DrinkWithTotal[]>;
export async function getDrinks(
  args: FindByArgs & { id: number },
): Promise<Drink | null>;
export async function getDrinks(
  args: FindByArgs & { slug: string },
): Promise<Drink | null>;
export async function getDrinks(
  args: Omit<FindByArgs, "id" | "slug">,
): Promise<Drink[]>;
export async function getDrinks(): Promise<Drink[]>;
export async function getDrinks(
  args?: FindByArgs,
): Promise<Drink | null | Drink[] | DrinkWithTotal[]> {
  const queryBuilder = knex<Drink>("drinks as d").select("d.*");
  const user = await currentUser();

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
      // Use a subquery to handle the rating sort to avoid aggregation conflicts
      const favoriteCountSubquery = knex("favorites")
        .count("* as count")
        .whereRaw("drink_id = d.id")
        .as("favorite_count");

      queryBuilder
        .select(favoriteCountSubquery)
        .orderBy("favorite_count", "desc");
      break;
  }

  if (typeof args?.page == "number" && typeof args?.pageSize == "number") {
    const offset = (args.page - 1) * args.pageSize;
    queryBuilder.offset(offset).limit(args.pageSize);
  }

  if (args?.withTotalDrinks) {
    queryBuilder.select(knex.raw("COUNT(*) OVER () as total_drinks"));
  }

  if (args?.difficulty) {
    queryBuilder.where("difficulty", args.difficulty);
  }

  if (args?.keyword?.trim()) {
    const keyword = args.keyword?.trim();
    queryBuilder.whereRaw(
      `d.name||d.description||garnish||difficulty||ingredients::text ilike '%${keyword}%'`,
    );
    trackSearch(keyword);
  }

  // fetching votes made by the current user
  if (user?.id) {
    queryBuilder
      .leftJoin("favorites AS fav", function (queryBuilder) {
        queryBuilder
          .on("d.id", "=", "fav.drink_id")
          .andOn(knex.raw("fav.user_id = ?", user.id));
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

  const result = await queryBuilder;
  return Array.isArray(result)
    ? result.map(mapRowToDrink)
    : mapRowToDrink(result);
}

export async function getFavoriteDrinks(
  userId: string,
  page: number,
  pageSize: number,
): Promise<DrinkWithTotal[]> {
  const offset = (page - 1) * pageSize;

  // Use a window function to get total count in the same query
  const queryBuilder = knex<Drink>("drinks as d")
    .select("d.*")
    .select(knex.raw("COUNT(*) OVER() as total_drinks"))
    .select(knex.raw("TRUE as is_favorite"))
    .innerJoin("favorites AS fav", function (queryBuilder) {
      queryBuilder
        .on("d.id", "=", "fav.drink_id")
        .andOn(knex.raw("fav.user_id = ?", userId));
    })
    .orderBy("d.id", "desc")
    .offset(offset)
    .limit(pageSize);

  // Mark all returned drinks as favorites since they're coming from the favorites table
  const drinks = await queryBuilder;
  return drinks.map(mapRowToDrink);
}

/**
 * Get the count of favorite drinks for a specific user
 * @param userId The ID of the user
 * @returns A Promise that resolves to the count of favorite drinks
 */
export async function countFavoriteDrinks(userId: string): Promise<number> {
  const result = await knex("favorites")
    .count("* as count")
    .where("user_id", userId)
    .first();

  return result ? Number(result.count) : 0;
}

export async function incrementViews(drinkId: number): Promise<void> {
  await knex("drinks").where("id", drinkId).increment("views", 1);
}

export async function getSlugsForSSR(): Promise<string[]> {
  return await knex("drinks as d")
    .pluck("d.slug")
    .whereNotNull("image_url")
    .orderBy("id", "desc");
}

export async function toggleFavorite(drinkId: number): Promise<string | void> {
  const { userId } = await auth();

  if (!userId) {
    return "You must be signed in to favorite.";
  }

  const rows = await knex("favorites")
    .insert({
      user_id: userId,
      drink_id: drinkId,
    })
    .onConflict(["user_id", "drink_id"])
    .ignore()
    .returning("id");

  // on conflict triggered
  if (rows.length == 0) {
    await knex("favorites")
      .where({
        user_id: userId,
        drink_id: drinkId,
      })
      .delete();
  }
}

type GenerateDrinkOptions = {
  byPassAuth?: boolean;
  creator?: User; // Optional because it's only required when byPassAuth is true
};

export async function generateDrink(
  ingredients: string[],
  opts?: GenerateDrinkOptions,
): Promise<Drink | string> {
  let creator;

  if (opts?.byPassAuth) {
    if (!opts.creator) {
      return "Creator is required when bypassing auth";
    }
    creator = opts.creator;
  } else {
    const user = await currentUser();
    if (!user) {
      return "You need to authenticate first.";
    }

    const { hasActiveSubscription } = await checkSubscription();
    if (!hasActiveSubscription) {
      return "You need an active subscription to use the AI Cocktail Builder.";
    }

    creator = user;
  }

  if (!Array.isArray(ingredients) || ingredients.length == 0) {
    return `List up to ${MAX_INGREDIENTS} ingredients.`;
  }

  if (ingredients.length > MAX_INGREDIENTS) {
    return "Too many ingredients!";
  }

  try {
    console.time("openai");

    const completion = await openai.beta.chat.completions.parse({
      model: `gpt-4o-mini`, //"gpt-4o",
      user: creator.id,
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
                - Alcohol Content (Non-Alcoholic, Light (0-10%), Medium (10-20%), or Strong (20%+))
                - Flavor Profile (Sweet, Sour, Bitter or Spicy)
                - Glassware (cocktail, highball, rocks, or wine)
                - Serving Temperature (frozen , cold , room , or hot)

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
                alcoholContent: "strong",
                flavorProfile: "sour",
                glassware: "rocks",
                temperature: "cold",
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

    console.time("saveDrink");
    const result = await saveDrink({
      name: recipe.parsed.name,
      preparationSteps: recipe.parsed.preparationSteps,
      description: recipe.parsed.description,
      ingredients: recipe.parsed.ingredients,
      isGeneratingImage: true,
      creator,
      difficulty: recipe.parsed.difficulty,
      glassType: recipe.parsed.glassType,
      preparationTime: recipe.parsed.preparationTime,
      garnish: recipe.parsed.garnish,
      alcoholContent: recipe.parsed.alcoholContent,
      flavorProfile: recipe.parsed.flavorProfile,
      glassware: recipe.parsed.glassware,
      temperature: recipe.parsed.temperature,
    });
    console.timeEnd("saveDrink");

    if (typeof result == "string") return result;
    const drink = result;

    // endpoint will return 200 immediatly. The long running operation will keep running
    console.log(`calling now ${BASE_URL}/api/drinkImage/${drink.id}`);

    const res = await fetch(`${BASE_URL}/api/drinkImage/${drink.id}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    if (!res.ok) {
      console.error(
        `failed to trigger drink #${drink.id} image generation: ${res.status} ${res.statusText}`,
      );
    }

    console.log(`revalidating paths`);

    // revalidating cached paginated files for home
    revalidatePath(`/(home)/[[...page]]`, "page");
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

export async function getNextDrinkToShare(
  network: "twitter" | "instagram",
): Promise<Drink | null> {
  const postColumn =
    network === "twitter" ? "tweet_posted_at" : "instagram_posted_at";
  if (!["twitter", "instagram"].includes(network)) {
    throw new Error("Invalid network: " + network);
  }

  const result = await knex("drinks")
    .whereNull(postColumn)
    .orderBy("id", "desc")
    .first();

  if (!result) return null;

  return mapRowToDrink(result);
}

type Stats = {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}[];

export async function getStats(): Promise<Stats> {
  const {
    rows: [row],
  } = await knex.raw(`
    SELECT 
      (SELECT COUNT(*) FROM drinks) AS total_drinks, 
      (SELECT COUNT(DISTINCT ingredient) 
       FROM drinks, LATERAL unnest(ingredients) AS ingredient) AS unique_ingredients
          `);

  const STATS = [
    { value: +row.total_drinks, suffix: "+", label: "Recipes" },
    { value: +row.unique_ingredients, suffix: "+", label: "Ingredients" },
    { value: 4.9, suffix: "/5", label: "Rating", decimals: 1 },
  ];

  return STATS;
}
