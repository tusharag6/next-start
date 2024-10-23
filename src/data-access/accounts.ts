import { eq } from "drizzle-orm";

import db from "@/db";
import { accounts } from "@/db/schema";

export async function getAccountByUserId(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  return account;
}

export async function createAccount(userId: string, password: string) {
  const [account] = await db
    .insert(accounts)
    .values({
      userId,
      accountType: "email",
      password,
    })
    .returning();
  return account;
}

export async function getAccountByGoogleId(googleId: string) {
  return await db.query.accounts.findFirst({
    where: eq(accounts.googleId, googleId),
  });
}
