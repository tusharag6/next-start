import db from "@/db";
import { profiles } from "@/db/schema";

export async function createProfile(
  userId: string,
  displayName: string,
  image?: string
) {
  const [profile] = await db
    .insert(profiles)
    .values({
      userId,
      image,
      displayName,
    })
    .onConflictDoNothing()
    .returning();
  return profile;
}
