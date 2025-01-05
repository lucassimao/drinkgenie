import { postInstagram } from "@/lib/marketing/instagram";
import { tweet } from "@/lib/marketing/twitter";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const url = new URL(request.url);
  const network = url.searchParams.get("network") || "unknow";

  console.time(network);

  switch (network) {
    case "twitter":
      await tweet();
      break;
    case "instagram":
      await postInstagram();
      break;
    default:
      console.error("Invalid network: " + network);
      return new Response(null, { status: 400 });
  }

  console.timeEnd(network);

  return Response.json({ success: true });
}
