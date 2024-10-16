import { eq, sql } from "drizzle-orm";

import db from "@/db";

import { users } from "./db/schema";

export function verifyEmailInput(email: string): boolean {
  return /^.+@.+\..+$/.test(email) && email.length < 256;
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    const result = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(users)
      .where(eq(users.email, email));

    return result[0].count === 0;
  } catch (error) {
    console.error("Error checking email availability:", error);
    throw new Error("Failed to check email availability");
  }
}
