"use server";
import { sql } from "@vercel/postgres";

export type Drink = {
  id: number;
  name: string;
  createdAt: Date;
  description: string;
  imageUrl: string;
  ingredients: string[];
  thumbsUp: number;
  thumbsDown: number;
};

export async function getLatestDrinkIdeas(n: number): Promise<Drink[]> {
  const { rows } =
    await sql`SELECT * from DRINKS ORDER BY created_at DESC LIMIT ${n};`;

  return rows.map(
    (row) =>
      ({
        id: row.id,
        name: row.name,
        createdAt: new Date(row.created_at),
        description: row.description,
        imageUrl: row.image_url,
        ingredients: row.ingredients,
        thumbsUp: row.thumbs_up,
        thumbsDown: row.thumbs_down,
      }) as Drink,
  );
}

export async function getBestIdeasListing(n: number): Promise<Drink[]> {
  const { rows } =
    await sql`SELECT * from DRINKS ORDER BY thumbs_up DESC, created_at DESC LIMIT ${n};`;

  return rows.map(
    (row) =>
      ({
        id: row.id,
        name: row.name,
        createdAt: new Date(row.created_at),
        description: row.description,
        imageUrl: row.image_url,
        ingredients: row.ingredients,
        thumbsUp: row.thumbs_up,
        thumbsDown: row.thumbs_down,
      }) as Drink,
  );
}

async function vote(drinkId: number, type: "up" | "down"): Promise<void> {
  if (type == "up") {
    await sql`UPDATE DRINKS SET thumbs_up = thumbs_up + 1  WHERE id = ${drinkId};`;
  } else {
    await sql`UPDATE DRINKS SET thumbs_down = thumbs_down + 1  WHERE id = ${drinkId};`;
  }
}

export async function thumbsUp(previousState: number, formData: FormData) {
  const drinkId = formData.get("drinkId");
  if (!drinkId) {
    throw new Error("no drink");
  }

  await vote(+drinkId, "up");
  return previousState + 1;
}

export async function thumbsDown(previousState: number, formData: FormData) {
  const drinkId = formData.get("drinkId");
  if (!drinkId) {
    throw new Error("no drink");
  }

  await vote(+drinkId, "down");
  // optmistically increasing by 1
  return previousState + 1;
}
