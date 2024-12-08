"use server";

import { BASE_URL, stripe } from "./utils";

export async function createCheckoutSession(
  credits: number,
  amountInCents: number,
  email?: string,
): Promise<string | null> {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "DrinkGenie credits",
            metadata: {
              credits,
              amountInCents,
              email: email || null,
            },
            description: `${credits} magical cocktail creation credits. 1 credit = 1 cocktail`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://your-site.com/success",
    cancel_url: `${BASE_URL}/credits`,
    customer_email: email,
  });
  return session.url || "";
}
