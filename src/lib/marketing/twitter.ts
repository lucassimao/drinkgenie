import knex from "@/lib/knex";
import { Drink } from "@/types/drink";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import slugify from "slugify";
import TwitterApi from "twitter-api-v2";
import { z } from "zod";
import { getNextDrinkToShare } from "../drinks";
import { recraftGenerate } from "../recraft";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function downloadMedia(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function generateTweetUsingOpenAI(drink: Drink): Promise<string> {
  console.time("openai");

  const completion = await openai.beta.chat.completions.parse({
    model: `gpt-4o`,
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `
            Write a fun and witty tweet to promote the cocktail ${drink.name} that includes:

            - A playful opening
            - An humorous middle section

            RULES:
              - Keep tweet length under 280 characters
              - Include one emoji in opening and one in closing if possible
              - Maintain a playful but not unprofessional tone
              - Incorporate at least one ingredient or characteristic of the cocktail
              - Always include the link
              - Ignore hashtags
          `,
          },
        ],
      },
      {
        role: "assistant",
        content: [
          {
            type: "text",
            text: `Life's too short for boring drinks! 🍸 Bourbon and maple syrup had a party, and this happened... Warning: may cause spontaneous jazz music playing 🎷 Level up your drink game: https://drinkgenie.app/drink/burbon #CocktailCraft #SipSipHooray`,
          },
        ],
      },
      {
        role: "assistant",
        content: [
          {
            type: "text",
            text: `Warning: This Maple Old Fashioned may cause extreme happiness 😎 It's like breakfast meets happy hour but better! Your future self will thank you: https://drinkgenie.app/drink/maple #MixologyMagic #DrinkCreative`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Could you please generate a tweet message for the following cocktail ( max length of 280 chars ):

            Name: ${drink.name}
            Description: ${drink.description}
            Ingredients: ${drink.ingredients}
            Preparation steps: ${drink.preparationSteps.join(`,`)}
            Link: https://drinkgenie.app/drink/${drink.slug}`,
          },
        ],
      },
    ],
    response_format: zodResponseFormat(
      z.object({
        text: z.string(),
      }),
      "tweet",
    ),
  });
  console.timeEnd("openai");

  if (!completion?.choices?.[0]?.message) {
    console.error(JSON.stringify(completion));
    throw new Error(`No results from openai for ${drink.id} ${drink.name}`);
  }

  const tweet = completion.choices[0].message;

  if (tweet.refusal) {
    console.error(tweet.refusal);
    throw new Error(`openai refused prompt for ${drink.id} ${drink.name}`);
  }

  if (!tweet.parsed?.text) {
    console.error(JSON.stringify(tweet.parsed));
    throw new Error(`No results from openai for ${drink.id} ${drink.name}`);
  }
  return tweet.parsed.text;
}

export async function tweet() {
  console.log("Preparing tweet");
  console.time(`postTweet`);
  const drink = await getNextDrinkToShare("twitter");

  if (!drink?.imageUrl) {
    console.log("no drink to tweet. Skipping");
    return;
  }

  console.log(`Drink to tweet: ${drink.slug}`);

  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
    accessSecret: process.env.X_API_ACCESS_SECRET!,
    accessToken: process.env.X_API_ACCESS_TOKEN,
  }).readWrite;

  try {
    await generateSumaryCardImage(drink);
    let tweet: string;
    let attempt = 0;

    do {
      tweet = await generateTweetUsingOpenAI(drink);
      ++attempt;
    } while (tweet.length > 280 && attempt < 5);

    if (tweet.length > 280)
      throw new Error(`Could not create a 280 chars tweet`);

    console.log(`posting ${tweet}`);

    await client.v2.tweet(tweet);
  } catch (error) {
    if (error instanceof Error) {
      // eslint-disable-next-line
      const { data, rateLimite } = error as any;
      const details = JSON.stringify({ data, rateLimite });
      console.error(`failed to tweet ${drink.slug}: ${details}`);
    }
    throw error;
  }

  console.log("Tweet successfully posted");

  await knex("drinks").where("id", drink.id).update({
    tweet_posted_at: knex.fn.now(),
  });
  console.timeEnd(`postTweet`);
}

export async function generateSumaryCardImage(drink: Drink): Promise<void> {
  if (drink.twitterSummaryLargeImage) return;

  console.log(`generating twitterSummaryLargeImage for ${drink.id}`);

  const prompt = `Professional photograph of the ${drink.name} cocktail. ${drink.description}. Preparation steps: ${drink.preparationSteps.join(",")}.Garnished with ${drink.garnish}. Glass type ${drink.glassType}`;

  // 2:1
  const buffer = await recraftGenerate(drink.id, prompt, 2048, 1024);

  const blob = new Blob([buffer], { type: "image/jpg" });

  const putResult = await put(slugify(drink.name.toLowerCase()), blob, {
    access: "public",
    addRandomSuffix: true,
  });

  await knex("drinks").where("id", drink.id).update({
    twitter_summary_large_image: putResult.url,
  });

  revalidatePath(`/drink/${drink.slug}`);

  console.log(`Sumary card image generated for ${drink.id}!`);
}
