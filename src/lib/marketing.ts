import TwitterApi, { EUploadMimeType } from "twitter-api-v2";
import { getNextDrinkToShare } from "./drinks";
import { sql } from "@vercel/postgres";

async function downloadMedia(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function postTweet() {
  console.log("Preparing tweet");
  console.time(`postTweet`);
  const drink = await getNextDrinkToShare("twitter");

  if (!drink) {
    console.log("no drink to tweet. Skipping");
    return;
  }

  console.log(`Drink to tweet: ${drink.slug}`);

  const buffer = await downloadMedia(drink.imageUrl);

  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
    accessSecret: process.env.X_API_ACCESS_SECRET!,
    accessToken: process.env.X_API_ACCESS_TOKEN,
  }).readWrite;

  console.log(`sending media`);

  const mediaId = await client.v1.uploadMedia(buffer, {
    mimeType: EUploadMimeType.Jpeg,
  });

  console.log(`media sent: ${mediaId}`);

  console.log("adding metadata");

  await client.v1.createMediaMetadata(mediaId, {
    alt_text: { text: drink.name },
  });

  console.log("metadata added");
  try {
    const parts = [
      drink.name,
      ":",
      `https://www.drinkgenie.app/drink/${drink.slug}`,
    ];
    const cappedDescription = drink.description.slice(
      0,
      280 - parts.join(" ").length + 2, // +2 to afford a white space before and after cappedDescription
    );
    // 2 is the index of the colon in the parts array + 1
    parts.splice(2, 0, cappedDescription);
    const text = parts.join(" ");

    await client.v2.tweet(text, {
      media: {
        media_ids: [mediaId],
      },
    });
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
