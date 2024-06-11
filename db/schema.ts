import {serial, text, pgTable, pgSchema, integer, timestamp} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import {relations} from "drizzle-orm";
import {z} from "zod";

export const accounts = pgTable("accounts", {
    id: text('id').primaryKey(),
    plaidid: text('plaid_id'),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
})

// one to many relation between accounts and transactions
export const accountsRelations = relations(accounts , ({ many }) => ({
    transactions: many(transactions)
}))


// Schema for inserting a user - can be used to validate API requests
export const insertAccountSchema = createInsertSchema(accounts)

export const categories = pgTable("categories", {
    id: text('id').primaryKey(),
    plaidid: text('plaid_id'),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
})

// one to many relation between categories and transactions
export const categoriesRelations = relations(categories , ({ many }) => ({
    transactions: many(transactions)
}))

export const insertCategorySchema = createInsertSchema(categories)

export const transactions = pgTable("transactions", {
    id: text('id').primaryKey(),
    amount: integer('amount').notNull(),
    payee: text('payee').notNull(),
    notes: text('notes'),
    date: timestamp('date', {mode: "date"}).notNull(),

    // section is used to define the relations between the tables
    //transaction is only loaded by the user who created it by creating relation to the account
    accountId: text('account_id').references(() => accounts.id, {
        onDelete: "cascade",
    }).notNull(),
    categoryId: text('category_id').references(() => categories.id, {
        onDelete: "set null", //deleting the category transaction is attached to sets it as uncategorized rather than remove transaction
    }),
})

//section to define the relations between the tables
export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
}))

// modified date z.coerce to make sure no errors appear in the front end javascript since it wont accept the type date
export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(z.string())
})