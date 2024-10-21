import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";

// TODO: this uses functions from nextjs layer, do something about it
import { getCurrentSession, setSessionTokenCookie } from "@/app/lib/session";
import {
  createSession,
  deleteSession,
  getSession,
  invalidateSession,
  updateSessionExpiration,
} from "@/data-access/sessions";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSessionUseCase(userId: string) {
  const sessionToken = generateSessionToken();
  const sessionId = encodeHexLowerCase(
    sha256(new TextEncoder().encode(sessionToken))
  );
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await createSession(session);
  setSessionTokenCookie(sessionToken, session.expiresAt);
  return session;
}

export async function validateRequest() {
  const { session } = await getCurrentSession();
  if (session === null) {
    return { session: null, user: null };
  }
  return validateSessionToken(session.id);
}

export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await getSession(sessionId);

  if (result.length < 1) {
    return { session: null, user: null };
  }

  const { user, session } = result[0];

  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteSession(session.id);
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await updateSessionExpiration(session.expiresAt, session.id);
  }

  return { session, user };
}

export async function invalidateSessionUseCase(sessionId: string) {
  await invalidateSession(sessionId);
}
