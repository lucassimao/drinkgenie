import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import knex from "@/lib/knex";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { subscriptionId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 },
      );
    }

    // Check if the subscription belongs to the user
    const subscription = await knex("subscriptions")
      .select("id")
      .where({ id: subscriptionId, user_id: userId })
      .first();

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    // Update the subscription status to cancelled
    await knex("subscriptions").where({ id: subscriptionId }).update({
      status: "cancelled",
      end_date: new Date(), // End the subscription immediately
    });

    return NextResponse.json({
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
