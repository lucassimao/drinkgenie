"use server";
import { sql } from "@vercel/postgres";
import Stripe from "stripe";

export async function getUserCredits(userId: string): Promise<number> {
  const { rows } = await sql`
      SELECT 
        (SELECT count(*) FROM drinks WHERE user_id = ${userId}) AS drink_count,
        (SELECT sum(total) FROM credits WHERE user_id = ${userId}) AS total_credits
    `;

  return rows[0].total_credits - rows[0].drink_count;
}

export async function checkSessionStatus(
  checkoutSessionId: string,
): Promise<boolean> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-10-28.acacia",
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    return session.payment_status === "paid";
  } catch (error) {
    console.error(error, "Error retrieving session:");
    return false;
  }
}
