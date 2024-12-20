"use server";
// import knex from "@/lib/knex";

export async function saveSubscriber(email: string): Promise<void> {
  console.log(`Subscribing ${email} ... lol`);

  // await knex("subscribers").insert({
  //   email: email,
  //   created_at: knex.fn.now(),
  // });
}
