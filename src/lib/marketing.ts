import { sql } from "@vercel/postgres";
import TwitterApi from "twitter-api-v2";
import { getNextDrinkToShare } from "./drinks";
import { Drink } from "@/types/drink";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

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
    model: `gpt-4o-mini`,
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `
            Write a fun and witty tweet to promote the cocktail ${drink.name} that includes:

            - Start with a playful opening similar to these :
            - Include an humorous middle section similar to these :
            - Add 2-3 relevant hashtags from the list bellow:
              - #ThirstyThursday 
              - #WeekendVibes 
              - #CocktailO'Clock 
              - #DrinkUp 
              - #MixologyMagic 
              - #HappyHour 
              - #DrinkCreative 
              - #CocktailCraft 
              - #SipSipHooray
            RULES:
              - Keep total length under 280 characters
              - Always include one emoji in opening and one in closing
              - Maintain a playful but not unprofessional tone
              - Incorporate at least one ingredient or characteristic of the cocktail
              - Always include the link
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
            text: `Could you please generate a tweet message for the following cocktail:

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

export async function postTweet() {
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
    const tweet = await generateTweetUsingOpenAI(drink);
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

  await sql`UPDATE drinks SET tweet_posted_at = NOW() WHERE ID=${drink.id}`;

  console.timeEnd(`postTweet`);
}

export async function postToFacebook() {
  console.log("postToFacebook not implemented");
}
