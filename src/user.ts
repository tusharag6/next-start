import { eq } from "drizzle-orm";

import db from "@/db";

import { users } from "./db/schema";
import { hashPassword } from "./password";

export function verifyUsernameInput(username: string): boolean {
  return (
    username.length > 3 && username.length < 32 && username.trim() === username
  );
}

export async function createUser(
  email: string,
  username: string,
  password: string
): Promise<User> {
  const passwordHash = await hashPassword(password);
  const payload = {
    name: username,
    email,
    password: passwordHash,
  };
  const [createdUser] = await db.insert(users).values(payload).returning();
  if (!createdUser || !createdUser.id) {
    throw new Error("Failed to create user");
  }
  return {
    id: createdUser.id,
    email: createdUser.email,
    name: createdUser.name,
    emailVerified: createdUser.emailVerified !== null,
  };
}

export async function getUserFromEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  emailVerified: boolean;
}
