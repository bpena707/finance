import { serial, text, pgTable, pgSchema } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
    id: text('id').primaryKey(),
    plaidid: text('plaid_id'),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
})