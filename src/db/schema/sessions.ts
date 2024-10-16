import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type Session = typeof sessions.$inferSelect;
