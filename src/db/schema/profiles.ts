import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const profiles = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  displayName: text("displayName"),
  imageId: text("imageId"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export type Profile = typeof profiles.$inferSelect;
