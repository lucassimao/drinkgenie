import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import knex from "@/lib/knex";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query all the user's subscriptions with their status
    const subscriptions = await knex("subscriptions")
      .select("id", "start_date", "end_date", "status", "created_at")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription history" },
      { status: 500 },
    );
  }
}
