import { eq, sql } from "drizzle-orm";

import db from "@/db";
import { accounts, users } from "@/db/schema";

export async function createUser(email: string) {
  const [user] = await db
    .insert(users)
    .values({
      email,
    })
    .returning();
  return user;
}

export async function getUserById(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user;
}

export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
}

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return user;
}

export async function isEmailAvailable(email: string): Promise<boolean> {
  const result = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(users)
    .where(eq(users.email, email));

  return result[0].count === 0;
}

export async function createAccountViaGoogle(userId: string, googleId: string) {
  await db
    .insert(accounts)
    .values({
      userId: userId,
      accountType: "google",
      googleId,
    })
    .onConflictDoNothing()
    .returning();
}
