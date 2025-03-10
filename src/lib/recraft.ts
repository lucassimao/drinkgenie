import "server-only";
import { notifyProductionIssue } from "./pagerduty";

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

  const finalPrompt = prompt.slice(0, 990);

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

    const payload = { drinkId, width, height, status, body: "" };
    try {
      payload.body = JSON.parse(text);
    } catch {
      payload.body = text;
    }
    notifyProductionIssue(
      `[Recraft] Image generation failed`,
      payload,
      "critical",
    );

    throw new Error(`failed to generate image:  ${status} ${text} `);
  }

  const result = await response.json();
  if (!result?.data?.length || typeof result.data[0].b64_json != "string") {
    throw new Error(`No data nor b64_json. result: ${JSON.stringify(result)}`);
  }

  return Buffer.from(result.data[0].b64_json, "base64");
}
