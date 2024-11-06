import { sql } from "@vercel/postgres";

type Drink = {
  id: number;
  name: string;
  createdAt: Date;
  description: string;
  imageUrl: string;
  ingredients: string[];
  thumbsUp: number;
  thumbsDown: number;
};

export async function getLatestInspirations(): Promise<Drink[]> {
  const { rows } = await sql`SELECT * from DRINKS ORDER BY created_at DESC LIMIT 10;`;

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
