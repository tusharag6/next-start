import { cookies } from "next/headers";

import { generateCodeVerifier, generateState } from "arctic";

import { google } from "@/lib/oauth";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  cookies().set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });
  cookies().set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
