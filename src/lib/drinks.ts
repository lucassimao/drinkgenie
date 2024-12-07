"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { QueryResultRow, sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import slugify from "slugify";
import { z } from "zod";
import { getUserCredits } from "./user";
import { db } from "@vercel/postgres";
import knex from "./knex";
import { Drink, ServiceError } from "@/types/drink";

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
  garnish: z.string().optional().nullable(),
});

type DrinkRecipe = z.infer<typeof DrinkRecipeSchema>;

export async function getLatestDrinkIdeas(
  n: number,
  page: number,
  ingredient?: string | null,
  loggedInUserId?: string | null, // logged in requesting drinks
  difficulty?: string | null,
): Promise<Drink[]> {
  const offset = (page - 1) * n;

  const queryBuilder = knex("drinks as d").select("d.*");

  if (ingredient) {
    queryBuilder.whereRaw(`array_to_string(d.ingredients, ',') ILIKE ?`, [
      `%${ingredient}%`,
    ]);
  }

  if (difficulty) {
    queryBuilder.where("difficulty", difficulty);
  }

  // fetching votes made by the current user
  if (loggedInUserId) {
    queryBuilder
      .leftJoin("favorites AS fav", function () {
        this.on("d.id", "=", "fav.drink_id").andOn(
          knex.raw("fav.user_id = ?", loggedInUserId),
        );
      })
      .select(
        knex.raw(
          "CASE WHEN fav.id IS NOT NULL THEN true ELSE false END AS is_favorite",
        ),
      );
  }

  queryBuilder.orderBy("d.created_at", "desc").limit(n).offset(offset);

  const { sql, bindings } = queryBuilder.toSQL().toNative();

  const client = await db.connect();

  // eslint-disable-next-line
  const { rows } = await client.query(sql, bindings as any);
  return rows.map(mapRowToDrink);
}

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
    thumbsUp: row.thumbs_up,
    thumbsDown: row.thumbs_down,
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
};

export async function findBy(): Promise<Drink[]>;
export async function findBy(
  args: FindByArgs & { id: number },
): Promise<Drink | null>;
export async function findBy(
  args: FindByArgs & { slug: string },
): Promise<Drink | null>;
export async function findBy(
  args?: FindByArgs,
): Promise<Drink | null | Drink[]> {
  const queryBuilder = knex<Drink>("drinks as d").select("d.*");

  if (args?.id) {
    queryBuilder.where("id", args.id).first();
  }

  if (args?.slug) {
    queryBuilder.where("slug", args.slug).first();
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

export async function getAllDrinkSlugs(): Promise<string[]> {
  const { rows } = await sql`SELECT slug from DRINKS;`;
  return rows.map((row) => row.slug);
}

type ActionResult<T> = T | { error: string };

type VoteResult = {
  thumbs_up: number;
  thumbs_down: number;
};
export async function vote(
  drinkId: number,
  vote: "up" | "down",
): Promise<ActionResult<VoteResult>> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to vote." };
  }

  // Can use LIMIT cuz the UNIQUE user_vote_idx ensures user can only vote once per drink
  const userVoteResult =
    await sql`SELECT * FROM user_vote WHERE user_id=${userId} AND drink_id=${drinkId} LIMIT 1`;

  const existingVote = userVoteResult.rows[0];

  const client = await db.connect();

  try {
    await client.sql`BEGIN`;
    let result;

    if (existingVote) {
      // removing vote
      if (existingVote.vote == vote) {
        await client.sql`DELETE from user_vote WHERE id=${existingVote.id};`;

        if (vote == "up") {
          result =
            await client.sql`UPDATE DRINKS SET thumbs_up = thumbs_up - 1  WHERE id = ${drinkId} RETURNING thumbs_up,thumbs_down;`;
        } else {
          result =
            await client.sql`UPDATE DRINKS SET thumbs_down = thumbs_down - 1  WHERE id = ${drinkId} RETURNING thumbs_up,thumbs_down;`;
        }
      } else {
        await client.sql`UPDATE user_vote SET vote=${vote} WHERE id=${existingVote.id};`;

        if (vote == "up") {
          result =
            await client.sql`UPDATE DRINKS SET thumbs_down = thumbs_down - 1, thumbs_up = thumbs_up + 1  WHERE id = ${drinkId} RETURNING thumbs_up,thumbs_down;`;
        } else {
          result =
            await client.sql`UPDATE DRINKS SET thumbs_down = thumbs_down + 1, thumbs_up = thumbs_up - 1  WHERE id = ${drinkId} RETURNING thumbs_up,thumbs_down;`;
        }
      }
    } else {
      await client.sql`INSERT INTO user_vote(user_id,vote,drink_id) values(${userId}, ${vote},${drinkId});`;

      if (vote == "up") {
        result =
          await client.sql`UPDATE DRINKS SET thumbs_up = thumbs_up + 1  WHERE id = ${drinkId} RETURNING thumbs_up,thumbs_down;`;
      } else {
        result =
          await client.sql`UPDATE DRINKS SET thumbs_down = thumbs_down + 1  WHERE id = ${drinkId} RETURNING thumbs_up,thumbs_down;`;
      }
    }

    await client.sql`COMMIT`;

    return result.rows[0] as VoteResult;
  } catch (error) {
    console.log(error, "failed to save vote");

    await client.sql`ROLLBACK`;
    return {
      error: "Oopsie daisy! Something went wrong. Blame the internet gremlins!",
    };
  }
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

export async function generateIdea(
  ingredients: string[],
): Promise<Drink | string> {
  const user = await currentUser();

  if (!user) {
    return "You need to authenticate first.";
  }

  const userId = user?.id;

  const userCredits = await getUserCredits(userId);
  if (userCredits <= 0) {
    return "No enough credits.";
  }

  if (!Array.isArray(ingredients) || ingredients.length < 3) {
    return "List at least 3 ingredients.";
  }

  if (ingredients.length > 6 || ingredients.join("").length > 100) {
    return "Too many ingredients!";
  }

  try {
    console.time("openai");

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      user: userId,
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
              text: `I have the following ingredients at home: ${ingredients.join(",")}. Give me a suggestion of a cocktail that I can prepare.`,
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
    const res = await fetch(`/api/drinkImage/${drink.id}`, {
      method: "POST",
    });

    if (!res.ok) {
      const result = await res.json();
      console.error(
        `failed to trigger drink #${drink.id} image generation: ${result}`,
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
  return "Sorry, we ran out of ideas for now.";
}

export async function getNextDrinkToShare(
  network: "twitter" | "facebook",
): Promise<Drink | null> {
  let result = null;

  if (network == "twitter") {
    result =
      await sql`SELECT * FROM drinks WHERE tweet_posted_at IS NULL ORDER BY ID DESC LIMIT 1`;
  } else if (network == "facebook") {
    result =
      await sql`SELECT * FROM drinks WHERE facebook_posted_at IS NULL ORDER BY ID DESC LIMIT 1`;
  } else {
    throw new Error("Invalid network: " + network);
  }

  if (result.rowCount == 0) return null;

  return mapRowToDrink(result.rows[0]);
}
