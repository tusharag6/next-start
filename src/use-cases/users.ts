import { sha1 } from "@oslojs/crypto/sha1";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { hash, verify } from "argon2";

import { getCurrentSession } from "@/app/lib/session";
import { createUser, getUserByEmail } from "@/data-access/users";

import { AuthenticationError, LoginError, PublicError } from "./errors";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return await verify(hash, password);
}

export async function verifyPasswordStrength(
  password: string
): Promise<boolean> {
  if (password.length < 8 || password.length > 255) {
    return false;
  }
  const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
  const hashPrefix = hash.slice(0, 5);
  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${hashPrefix}`
  );
  const data = await response.text();
  const items = data.split("\n");
  for (const item of items) {
    const hashSuffix = item.slice(0, 35).toLowerCase();
    if (hash === hashPrefix + hashSuffix) {
      return false;
    }
  }
  return true;
}

export function verifyUsernameInput(username: string): boolean {
  return (
    username.length > 3 && username.length < 32 && username.trim() === username
  );
}

export async function registerUserUseCase(
  email: string,
  password: string,
  name: string
) {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new PublicError("An user with that email already exists.");
  }

  const strongPassword = await verifyPasswordStrength(password);
  if (!strongPassword) {
    throw new PublicError("Weak Password");
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser(email, passwordHash, name);

  return { id: user.id };
}

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new LoginError();
  }

  const passwordHash = user?.password || "";

  const isPasswordCorrect = await verifyPassword(passwordHash, password);

  if (!isPasswordCorrect) {
    throw new LoginError();
  }

  return { id: user.id };
}

export const assertAuthenticated = async () => {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};
