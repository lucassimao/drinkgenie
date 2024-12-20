import { generateDrink } from "@/lib/drinks";
import knex from "@/lib/knex";
import { generateSumaryCardImage } from "@/lib/marketing/twitter";
import { User } from "@clerk/nextjs/server";
import { RANDOM_USERS } from "./mockData";
import { notifyProductionIssue } from "@/lib/pagerduty";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const ingredients = await knex
    .with("random_ingredients", (qb) =>
      qb.select(
        knex.raw(`
        (SELECT name FROM ingredients WHERE type = 'spirit' ORDER BY random() LIMIT 1) as spirit,
        (SELECT name FROM ingredients WHERE type IN ('liqueur', 'fortified_wine') ORDER BY random() LIMIT 1) as modifier,
        (SELECT name FROM ingredients WHERE type IN ('juice', 'fruit') ORDER BY random() LIMIT 1) as fresh,
        (SELECT name FROM ingredients WHERE type NOT IN ('juice', 'fruit', 'liqueur', 'fortified_wine', 'spirit') ORDER BY random() LIMIT 1) as enhancement
      `),
      ),
    )
    .select("*")
    .from("random_ingredients")
    .first();

  console.log(`Generating drink based on: ${JSON.stringify(ingredients)}`);

  const randomCreator =
    RANDOM_USERS[Math.floor(Math.random() * RANDOM_USERS.length)];

  console.log(`creator: ${randomCreator.fullName}`);

  const result = await generateDrink(
    [
      ingredients.spirit,
      ingredients.modifier,
      ingredients.fresh,
      ingredients.enhancement,
    ],
    { byPassAuth: true, creator: randomCreator as User },
  );

  if (typeof result == "string") {
    notifyProductionIssue(
      "[Bartender] Failed to generate drink",
      ingredients,
      "warning",
    );
    return new Response("", {
      status: 500,
      statusText: result,
    });
  } else {
    await generateSumaryCardImage(result);
  }

  return new Response("ok", {
    status: 200,
  });
}
