import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  //   image: varchar("image", { length: 2048 }).notNull(),
});

export type User = typeof users.$inferSelect;
