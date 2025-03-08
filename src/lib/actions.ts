"use server";

import { auth } from "@clerk/nextjs/server";

import knex from "@/lib/knex";

export async function checkSubscription() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { hasActiveSubscription: false };
    }

    // Query the subscriptions table to find an active subscription
    const now = new Date();
    const subscription = await knex("subscriptions")
      .select("id")
      .where({ user_id: userId, status: "active" })
      .where("end_date", ">=", now)
      .first();

    return {
      hasActiveSubscription: Boolean(subscription),
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return {
      hasActiveSubscription: false,
      error: "Failed to check subscription",
    };
  }
}
