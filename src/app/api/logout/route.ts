import { NextResponse } from "next/server";

import { deleteSessionTokenCookie, getCurrentSession } from "@/app/lib/session";
import { invalidateSession } from "@/auth";

export async function POST() {
  const { session } = await getCurrentSession();
  if (session) {
    await invalidateSession(session.id);
    deleteSessionTokenCookie();
  }
  return NextResponse.json({ success: true });
}
