import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const accountTypeEnum = pgEnum("type", ["email", "google", "github"]);

export const accounts = pgTable(
  "account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountType: accountTypeEnum("accountType").notNull(),
    githubId: text("githubId").unique(),
    googleId: text("googleId").unique(),
    password: text("password"),
    //   salt: text("salt"),
  },
  (table) => ({
    userIdAccountTypeIdx: index("user_id_account_type_idx").on(
      table.userId,
      table.accountType
    ),
  })
);

export type Account = typeof accounts.$inferSelect;
