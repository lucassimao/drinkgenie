"use server";
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
