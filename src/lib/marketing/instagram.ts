import knex from "@/lib/knex";
import { Drink } from "@/types/drink";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";
import { notifyProductionIssue } from "../pagerduty";
import { getNextDrinkToShare } from "../drinks";
import { recraftGenerate } from "../recraft";
import slugify from "slugify";
import { put } from "@vercel/blob";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_LENGTH = 2200;

export async function postInstagram() {
  console.log("Preparing post");
  const drink = await getNextDrinkToShare("instagram");

  if (!drink?.imageUrl) {
    console.log("[INSTAGRAM] no drink to post. Skipping");
    return;
  }

  console.log(`Drink to share: ${drink.slug}`);
  try {
    // eslint-disable-next-line
    let [imageUrl, caption] = await Promise.all([
      generateMedia(drink),
      generateCaption(drink),
    ]);
    // console.log(imageUrl);
    // console.log(caption);

    // let caption: string;
    // let attempt = 0;

    // do {
    //   caption = await generateCaption(drink);
    //   ++attempt;
    // } while (caption.length > MAX_LENGTH && attempt < 3);

    if (caption.length > MAX_LENGTH) {
      console.log(
        `failed to generate a ${MAX_LENGTH} chars caption. falling back to default template`,
      );
      caption = fallbackCaption(drink);
    }

    console.log(`Instagram caption generated`);

    const mediaResponse = await fetch(
      `https://graph.instagram.com/v21.0/${process.env.INSTAGRAM_USER_ID}/media`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.INSTAGRAM_APP_SECRET}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          caption: caption,
          image_url: imageUrl,
        }),
      },
    );

    const mediaResponseData = await mediaResponse.json();

    if (!mediaResponse.ok) {
      throw {
        message: `Failed to upload instagram media`,
        data: mediaResponseData,
      };
    }

    console.log(`Instagram media ${mediaResponseData.id} uploaded`);

    const mediaPublishResponse = await fetch(
      `https://graph.instagram.com/v21.0/${process.env.INSTAGRAM_USER_ID}/media_publish`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.INSTAGRAM_APP_SECRET}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          creation_id: mediaResponseData.id,
        }),
      },
    );

    const mediaPublishResponseData = await mediaPublishResponse.json();
    if (!mediaPublishResponse.ok) {
      throw {
        message: `Failed to publish instagram media ${mediaResponseData.id}`,
        data: mediaPublishResponseData,
      };
    }
    console.log(`media ${mediaResponseData.id} posted to instagram`);
  } catch (error) {
    console.error(error);
    notifyProductionIssue("[Instagram] Failed to post", { error }, "warning");
    throw error;
  }

  await knex("drinks").where("id", drink.id).update({
    instagram_posted_at: knex.fn.now(),
  });
}

function fallbackCaption(drink: Drink): string {
  return `
      ${drink.name}

      🍸 Ingredients:
      ${drink.ingredients.join("\n")} 

      ⏱️ Prep Time: ${drink.preparationTime}

      📝 How to Mix:
      ${drink.preparationSteps.join("\n")} 

      🔗 Visit https://drinkgenie.app for more recipes! 

      #craftcocktails #mixology #cocktailrecipes #bartenderlife #drinkstagram`;
}

async function generateCaption(drink: Drink): Promise<string> {
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
              Create an engaging Instagram caption for a ${drink.name} cocktail photo that includes:

              🍸 Ingredients:
              [List ingredients with measurements]

              ⏱️ Prep Time: [X] minutes

              📝 How to Mix:
              [3-4 preparation steps]

              💫 Fun Fact: [Something interesting about ingredients/history]

              🔗 Visit https://drinkgenie.app for more recipes! 

              #craftcocktails #mixology #cocktailrecipes #bartenderlife #drinkstagram`,
          },
        ],
      },
      {
        role: "assistant",
        content: [
          {
            type: "text",
            text: `Use this structure and add relevant hashtags (limit: 30) and emojis to increase engagement while staying within ${MAX_LENGTH} characters.`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Could you please generate a instagram post for the following cocktail:

            Name: ${drink.name}
            Description: ${drink.description}
            Ingredients: ${drink.ingredients.join(",")}
            Preparation steps: ${drink.preparationSteps.join(`,`)}
            Prep Time: ${drink.preparationTime}`,
          },
        ],
      },
    ],
    response_format: zodResponseFormat(
      z.object({
        text: z.string(),
      }),
      "post",
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

export async function generateMedia(drink: Drink): Promise<string> {
  if (drink.instagramImage) return drink.instagramImage;

  console.log(`generating instagram media for ${drink.id}`);

  const prompt = `Professional photograph of the ${drink.name} cocktail. ${drink.description}. Preparation steps: ${drink.preparationSteps.join(",")}.Garnished with ${drink.garnish}. Glass type ${drink.glassType}`;

  // 1:1
  const buffer = await recraftGenerate(drink.id, prompt, 1024, 1024);

  const blob = new Blob([buffer], { type: "image/jpg" });

  const putResult = await put(slugify(drink.name.toLowerCase()), blob, {
    access: "public",
    addRandomSuffix: true,
  });

  await knex("drinks").where("id", drink.id).update({
    instagram_image: putResult.url,
  });

  console.log(`Instagram media generated for ${drink.id}!`);
  return putResult.url;
}
