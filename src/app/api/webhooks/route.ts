import knex from "@/lib/knex";
import { notifyProductionIssue } from "@/lib/pagerduty";
import stripe from "@/lib/stripe";
import { createClerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";

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

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function POST(req: Request) {
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  try {
    if (!sig) {
      throw new Error("no signature header");
    }

    const rawBody = await getRawBody(req);

    const event = stripe.webhooks.constructEvent(
      rawBody.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET!,
    );

    if (
      event.type != "checkout.session.completed" ||
      event.data.object.payment_status != "paid"
    ) {
      return new Response("ok", {
        status: 200,
      });
    }

    console.log(`processing ${event.type}`);

    const session = event.data.object;
    const customerEmail =
      session.customer_email || session.customer_details?.email;

    if (!session.amount_subtotal) {
      throw new Error("no amount!");
    }
    // session.amount_subtotal comes as cents
    // using trunc here to ignore any cents e.g if session.amount_subtotal is 10075 then totalInUSD will be just $100
    const totalInUSD = session.amount_subtotal / 100;

    if (!customerEmail) throw new Error("no customer email");

    const user = await clerkClient.users
      .getUserList({
        emailAddress: [customerEmail],
      })
      .then((result) => result.data?.[0]);

    if (!user)
      throw new Error(`no customer associated to email ${customerEmail}`);

    await knex("credits").insert({
      user_id: user.id,
      total: session.metadata?.credits || 0,
      stripe_id: event.id,
      stripe_event: JSON.stringify(session),
    });

    console.log(
      `Processed checkout.session.completed for ${customerEmail} ${session.currency} ${totalInUSD}`,
    );
  } catch (err) {
    notifyProductionIssue(
      "[Stripe] Failed to process webhook",
      { err },
      "critical",
    );

    console.error(err, `Failed to process stripe webhook`);
    let details: string;

    if (err instanceof Error) {
      details = err.message;
    } else if (typeof err == "string") {
      details = err;
    } else {
      details = String(err);
    }
    return new Response(details, {
      status: 400,
    });
  }

  return new Response("ok", {
    status: 200,
  });
}
