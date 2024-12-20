import "server-only";
import Stripe from "stripe";
import { notifyProductionIssue } from "./notification";
import { BASE_URL } from "./utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

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
      notifyProductionIssue("Failed to fetch USD to BRL rate");
      brlRate = 6;
    }

    unitAmount = Math.round(amountInCents * brlRate);
  }

  const session = await stripe.checkout.sessions.create({
    metadata: {
      credits,
      amountInCents: unitAmount,
      email: email || null,
      currency,
      amountInUSDCents: amountInCents,
      brlRate,
    },
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `${credits} DrinkGenie credits`,

            description: `${credits} magical cocktail creation credits. 1 credit = 1 cocktail`,
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${BASE_URL}/credits/success?credits=${credits}`,
    cancel_url: `${BASE_URL}/credits`,
    customer_email: email,
  });
  return session.url;
}

export default stripe;
