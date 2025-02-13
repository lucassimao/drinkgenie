"use server";
import { track } from "@vercel/analytics/server";
import { notifyProductionIssue } from "./pagerduty";
import stripe from "./stripe";
import { BASE_URL } from "./utils";

export async function createCheckoutSession(
  credits: number,
  amountInCents: number,
  email?: string,
  countryCode?: string,
): Promise<string | null> {
  const currency = countryCode?.toLowerCase() === "br" ? "brl" : "usd";
  let unitAmount = amountInCents;
  let brlRate;

  if (currency == "brl") {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=BRL",
    );
    if (response.ok) {
      const data = await response.json();
      brlRate = data.rates.BRL;
    } else {
      notifyProductionIssue(
        "[Stripe] Failed to fetch USD to BRL rate",
        { credits, amountInCents, email, countryCode },
        "warning",
      );
      brlRate = 6;
    }

    unitAmount = Math.round(amountInCents * brlRate);
  }

  const isProduction = process.env.NODE_ENV == "production";

  const session = await stripe.checkout.sessions.create({
    metadata: {
      amountInCents: unitAmount,
      email: email || null,
      currency,
      amountInUSDCents: amountInCents,
      brlRate,
    },
    line_items: [
      {
        price: isProduction
          ? "price_1QrrtxGIsJDYEH18F0IHkQcn"
          : "price_1QrrxkGIsJDYEH188sNvAsHq",
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${BASE_URL}/credits/success?credits=${credits}`,
    cancel_url: `${BASE_URL}/credits`,
    customer_email: email,
  });

  if (isProduction) {
    await track("CheckoutSession", {
      credits,
      amountInCents,
      email: email || "",
      countryCode: countryCode || "",
    });
  }

  return session.url;
}
