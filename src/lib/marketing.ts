import TwitterApi from "twitter-api-v2";
import { getNextDrinkToShare } from "./drinks";
import { Drink } from "@/types/drink";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import knex from "@/lib/knex";
import { put } from "@vercel/blob";
import slugify from "slugify";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

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
            - Add 2-3 relevant hashtags from the list bellow ( Only if there is enough room in the tweet message ):
              - #CocktailO'Clock 
              - #DrinkUp 
              - #MixologyMagic 
              - #HappyHour 
              - #DrinkCreative 
              - #CocktailCraft 
              - #SipSipHooray

            RULES:
              - Keep tweet length under 280 characters
              - Include one emoji in opening and one in closing if possible
              - Maintain a playful but not unprofessional tone
              - Incorporate at least one ingredient or characteristic of the cocktail
              - Always include the link
              - Ignore hashtags if no enough chars
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
    await generateImageForLargeTwitterCard(drink);
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

  await knex("drinks").where("id", drink.id).update({
    tweet_posted_at: knex.fn.now(),
  });
  console.timeEnd(`postTweet`);
}

async function generateImageForLargeTwitterCard(drink: Drink): Promise<void> {
  if (drink.twitterSummaryLargeImage) return;

  console.log(`generating twitterSummaryLargeImage for ${drink.id}`);

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
        size: "2048x1024",
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

  // Target aspect ratio is 1.91:1
  // For height 1024px, ideal width would be: 1024 * 1.91 = 1956px
  // Current width is 2048px, so we need to crop 92px total (46px from each side)
  const croppedImage = await sharp(Buffer.from(binaryData))
    .extract({
      left: 46,
      top: 0,
      width: 1956, // 2048 - (46 * 2)
      height: 1024,
    })
    .toBuffer();

  const blob = new Blob([croppedImage], { type: "image/jpg" });

  const putResult = await put(slugify(drink.name.toLowerCase()), blob, {
    access: "public",
    addRandomSuffix: true,
  });

  await knex("drinks").where("id", drink.id).update({
    twitter_summary_large_image: putResult.url,
  });

  revalidatePath(`/drink/${drink.slug}`);

  console.log(`image generated for ${drink.id}!`);
}
export async function postToFacebook() {
  console.log("postToFacebook not implemented");
}
