"use server";
import Stripe from "stripe";
import knex from "@/lib/knex";

export async function getUserCredits(userId: string): Promise<number> {
  const { rows } = await knex.raw(
    `
    SELECT
      (SELECT count(*) FROM drinks WHERE user_id = ?) AS drink_count,
      (SELECT sum(total) FROM credits WHERE user_id = ?) AS total_credits
  `,
    [userId, userId],
  );

  return rows[0].total_credits - rows[0].drink_count;
}

export async function checkSessionStatus(
  checkoutSessionId: string,
): Promise<boolean> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    return session.payment_status === "paid";
  } catch (error) {
    console.error(error, "Error retrieving session:");
    return false;
  }
}
