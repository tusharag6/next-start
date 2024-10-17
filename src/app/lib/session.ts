import { cookies } from "next/headers";
import { cache } from "react";

import "server-only";

import { SessionValidationResult, validateSessionToken } from "@/auth";
import { env } from "@/env/server";

export function setSessionTokenCookie(token: string, expiresAt: Date): void {
  cookies().set("session", token, {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  });
}

export function deleteSessionTokenCookie(): void {
  cookies().set("session", "", {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export const getCurrentSession = cache(
  (): Promise<SessionValidationResult> | SessionValidationResult => {
    const token = cookies().get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = validateSessionToken(token);
    return result;
  }
);
