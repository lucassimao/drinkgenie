"use server";

import { auth } from "@clerk/nextjs/server";
import knex from "@/lib/knex";
import stripe from "@/lib/stripe";
import { notifyProductionIssue } from "@/lib/pagerduty";

export async function getSubscriptionHistory() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Query all the user's subscriptions with their status
    const subscriptions = await knex("subscriptions")
      .select(
        "id",
        "start_date",
        "end_date",
        "status",
        "created_at",
        "stripe_id",
      )
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    return { subscriptions };
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    throw new Error("Failed to fetch subscription history");
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!subscriptionId) {
      throw new Error("Subscription ID is required");
    }

    // Check if the subscription belongs to the user and get Stripe details
    const subscription = await knex("subscriptions")
      .select("id", "stripe_id", "stripe_event")
      .where({ id: subscriptionId, user_id: userId })
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const stripeSubscriptionId = subscription.stripe_event.subscription;

    // If we have a Stripe subscription ID, cancel it in Stripe
    if (stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(stripeSubscriptionId);
        console.log(
          `Successfully cancelled Stripe subscription: ${stripeSubscriptionId}`,
        );
      } catch (stripeError) {
        console.error("Error cancelling Stripe subscription:", stripeError);
        // Continue with the local cancellation even if Stripe fails
      }
    } else {
      notifyProductionIssue(
        "[Stripe] No stripe subscription id to cancel!",
        { subscriptionId },
        "warning",
      );
    }

    // Update the subscription status to cancelled in our database
    await knex("subscriptions").where({ id: subscriptionId }).update({
      status: "cancelled",
      end_date: new Date(), // End the subscription immediately
    });

    return { message: "Subscription cancelled successfully" };
  } catch (error) {
    notifyProductionIssue(
      "[Stripe] Failed to cancel subscription",
      { err: error, subscriptionId },
      "critical",
    );
    throw error;
  }
}
