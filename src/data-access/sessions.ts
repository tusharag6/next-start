import { eq } from "drizzle-orm";

import db from "@/db";
import { Session, sessions, users } from "@/db/schema";

export async function createSession(session: Session) {
  await db.insert(sessions).values(session);
  return session;
}

export async function getSession(sessionId: string) {
  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));

  return result;
}

export async function updateSessionExpiration(
  expiresAt: Date,
  sessionId: string
) {
  await db
    .update(sessions)
    .set({
      expiresAt: expiresAt,
    })
    .where(eq(sessions.id, sessionId));
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
