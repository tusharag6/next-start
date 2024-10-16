"use server";

import { redirect } from "next/navigation";

import { verifyEmailInput } from "@/email";
import { verifyPasswordHash } from "@/password";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/session";
import { getUserFromEmail } from "@/user";

export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return {
      message: "Invalid or missing fields",
    };
  }
  if (email === "" || password === "") {
    return {
      message: "Please enter your email and password.",
    };
  }
  if (!verifyEmailInput(email)) {
    return {
      message: "Invalid email",
    };
  }
  const user = await getUserFromEmail(email);
  if (user === null) {
    return {
      message: "Account does not exist",
    };
  }
  const passwordHash = user?.password || "";
  const validPassword = await verifyPasswordHash(passwordHash, password);
  if (!validPassword) {
    return {
      message: "Invalid password",
    };
  }
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user?.id || "");
  setSessionTokenCookie(sessionToken, session.expiresAt);

  return redirect("/");
}

interface ActionResult {
  message: string;
}
