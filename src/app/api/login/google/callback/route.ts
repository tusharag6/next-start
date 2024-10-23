import { cookies } from "next/headers";

import { OAuth2RequestError } from "arctic";

import { google } from "@/lib/oauth";
import { getAccountByGoogleIdUseCase } from "@/use-cases/accounts";
import { createSessionUseCase } from "@/use-cases/sessions";
import { createGoogleUserUseCase } from "@/use-cases/users";

interface TokenResponse {
  data: {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
    id_token: string;
  };
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = (await google.validateAuthorizationCode(
      code,
      codeVerifier
    )) as TokenResponse;
    const accessToken = tokens.data.access_token;
    if (!accessToken || typeof accessToken !== "string") {
      throw new Error("Invalid access token received from Google");
    }

    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    const googleUser: GoogleUser = await response.json();

    const existingAccount = await getAccountByGoogleIdUseCase(googleUser.sub);

    if (existingAccount) {
      await createSessionUseCase(existingAccount.userId);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = await createGoogleUserUseCase(googleUser);
    await createSessionUseCase(userId);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.error("Detailed error:", e);

    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}
