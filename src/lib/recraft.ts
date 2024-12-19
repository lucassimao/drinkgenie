import "server-only";
import { notifyProductionIssue } from "./notification";

export async function recraftGenerate(
  drinkId: number,
  prompt: string,
  width: number,
  height: number,
): Promise<Buffer> {
  if (prompt.length > 1_000) {
    console.log(
      `prompt for ${drinkId} has ${prompt.length} chars and will be trimmed`,
    );
  }

  const finalPrompt = prompt.slice(0, 1000);

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
        size: `${width}x${height}`,
        model: "recraftv3",
        prompt: finalPrompt,
      }),
    },
  );

  if (!response.ok) {
    const { status } = response;
    const text = await response.text();

    try {
      const errorDetails = JSON.parse(text);
      if (errorDetails.code == "not_enough_credits") {
        notifyProductionIssue(`Not enough credits for recraft`);
      }
    } catch (error) {
      console.error(error);
      // just ignore, most likely the response body is empty
    }
    throw new Error(`failed to generate image:  ${status} ${text} `);
  }

  const result = await response.json();
  if (!result?.data?.length || typeof result.data[0].b64_json != "string") {
    throw new Error(`No data nor b64_json. result: ${JSON.stringify(result)}`);
  }

  return Buffer.from(result.data[0].b64_json, "base64");
}
