import "server-only";

export async function recraftGenerate(
  prompt: string,
  width: number,
  height: number,
): Promise<Buffer> {
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
        prompt,
      }),
    },
  );

  if (!response.ok) {
    const { status, text } = response;
    throw new Error(`failed to generate image:  ${status} ${text} `);
  }

  const result = await response.json();
  if (!result?.data?.length || typeof result.data[0].b64_json != "string") {
    throw new Error(`No data nor b64_json. result: ${JSON.stringify(result)}`);
  }

  return Buffer.from(result.data[0].b64_json, "base64");
}
