"use server";

import { redirect } from "next/navigation";

import { setSessionTokenCookie } from "@/app/lib/session";
import { createSession, generateSessionToken } from "@/auth";
import { checkEmailAvailability, verifyEmailInput } from "@/email";
import { verifyPasswordStrength } from "@/password";
import { createUser, verifyUsernameInput } from "@/user";

export async function signupAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return {
      message: "Invalid or missing fields",
    };
  }
  if (email === "" || password === "" || username === "") {
    return {
      message: "Please enter your username, email, and password",
    };
  }
  if (!verifyEmailInput(email)) {
    return {
      message: "Invalid email",
    };
  }
  const emailAvailable = checkEmailAvailability(email);
  if (!emailAvailable) {
    return {
      message: "Email is already used",
    };
  }
  if (!verifyUsernameInput(username)) {
    return {
      message: "Invalid username",
    };
  }
  const strongPassword = await verifyPasswordStrength(password);
  if (!strongPassword) {
    return {
      message: "Weak password",
    };
  }
  const user = await createUser(email, username, password);
  if (!user || !user.id) {
    return {
      message: "Failed to create user",
    };
  }
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);
  return redirect("/");
}

interface ActionResult {
  message: string;
}
