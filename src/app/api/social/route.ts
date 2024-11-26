import { postToFacebook, postTweet } from "@/lib/marketing";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const network = url.searchParams.get("network");

  switch (network) {
    case "twitter":
      await postTweet();
      break;
    case "facebook":
      console.log("Sending facebook post");
      postToFacebook();
      break;
    default:
      console.error("Invalid network: " + network);
      break;
  }

  return Response.json({ success: true });
}
