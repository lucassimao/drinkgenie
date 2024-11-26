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

  const drink = await getNextDrinkToShare("twitter");

  if (!drink) {
    console.log("no drink to tweet. Skipping");
    return;
  }

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

  await client.v2.tweet(
    `${drink.description} https://drinkgenie.app/drink/${drink.slug}`,
    {
      media: {
        media_ids: [mediaId],
      },
    },
  );

  console.log("Tweet successfully posted");

  await sql`UPDATE drinks SET tweet_posted_at = NOW() WHERE ID=${drink.id}`;
}

export async function postToFacebook() {
  console.log("postToFacebook not implemented");
}
