import { headers } from "next/headers";
import Stripe from "stripe";

async function getRawBody(req: Request): Promise<Buffer> {
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];

  if (!reader) {
    throw new Error("Request body is empty or already consumed.");
  }

  let done, value;
  while ((({ done, value } = await reader.read()), !done)) {
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return new Response("no signature header", {
      status: 400,
    });
  }

  let event;

  try {
    const rawBody = await getRawBody(req);
    console.log(rawBody.toString());
    console.log({ sig });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-10-28.acacia",
    });
    event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET!,
    );
  } catch (err) {
    console.error(err, `⚠️  Webhook signature verification failed.`);
    return new Response("signature verification failed", {
      status: 400,
    });
  }

  console.log({
    event: JSON.stringify(event),
  });

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log({ session });
      console.log("Payment was successful!");
      // Here you can update your database, send an email, etc.
      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log({ paymentIntent });
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    // Add more event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response("ok", {
    status: 200,
  });
}
