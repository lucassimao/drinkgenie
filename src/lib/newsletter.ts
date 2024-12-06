"use server";

import { sql } from "@vercel/postgres";

export async function saveSubscriber(email: string): Promise<void> {
  await sql`
        INSERT INTO subscribers (email,created_at) values (${email},now()); 
      `;
}
