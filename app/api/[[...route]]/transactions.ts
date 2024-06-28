//this is where all the api requests for accounts are handled

import {Hono} from "hono";
import {transactions, insertTransactionSchema, categories, accounts} from "@/db/schema";
import {db} from "@/db/drizzle";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import {and, desc, eq, gte, inArray, lte, sql} from "drizzle-orm";
import {zValidator} from "@hono/zod-validator";
import {createId} from "@paralleldrive/cuid2"
import {z} from "zod";
import {subDays, parse} from "date-fns";


const app = new Hono()

//get all accounts as long as the user is authenticated if not then throw an error
    .get(
        "/",
        // filter transactions by dates and accountId
        zValidator("query", z.object({
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string().optional(),
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c)
            const { from, to, accountId } = c.req.valid("query")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            // in case we cant find the date we don't want to see the entire history of transactions
            const defaultTo = new Date()
            const defaultFrom = subDays(defaultTo, 30)
            const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom
            const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo

            //transactions do not belong to the user they belong to the account so a series of joins and equalities are used to ensure the user only sees their own transactions
        const data = await db
            // select is used for security by only allowing id and name to display in front end
            .select({
                id: transactions.id,
                date: transactions.date,
                category: categories.name, //category name is displayed in the front end along with id
                categoryId: transactions.categoryId, //helps to find the category id in the array
                payee: transactions.payee,
                amount: transactions.amount,
                notes: transactions.notes,
                account: accounts.name,
                accountId: transactions.accountId,

            })
            .from(transactions)
            // ensure every transaction is only loaded by the user who created it by creating relation to the account
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            //in case category doesn't exist we can still load the transaction
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
                and(
                    //if there is an account id only load transactions for that account id if not skip it with undefined
                    accountId ? eq(transactions.accountId, accountId) : undefined,
                    eq(accounts.userId, auth.userId), //ensure user can only see their own transactions
                    gte(transactions.date, startDate), //ensure transactions are within the date range
                    lte(transactions.date, endDate) //ensure transactions are within the date range
                )
            )
            .orderBy(desc(transactions.date))

        return c.json({ data })
    })
    // get an account by id
    .get(
        "/:id",
        zValidator("param", z.object({
            id: z.string().optional()
        })),
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")

            if(!id) {
                return c.json({ error: "Invalid id" }, 400)
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const [data] = await db
                .select({
                    id: transactions.id,
                    date: transactions.date,
                    categoryId: transactions.categoryId,
                    payee: transactions.payee,
                    amount: transactions.amount,
                    notes: transactions.notes,
                    accountId: transactions.accountId,
                })
                .from(transactions)
                //endsure acount id is equal to the account id in the array
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        eq(transactions.id, id),
                        eq(accounts.userId, auth.userId),
                    )
                )
            if (!data) {
                return c.json({ error: "Transaction not found" }, 404)
            }

            return c.json({ data })
        }
    )
    .post(
        '/',
        clerkMiddleware(),
        // omit means to include everything except the id
        zValidator('json', insertTransactionSchema.omit({
            id: true
        })),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const [data] = await db.insert(transactions).values({
                id: createId(),
                ...values,
            }).returning()

            return c.json({ data })
        }
    )
    .post(
        "/bulk-create",
        clerkMiddleware(),
        zValidator(
            "json",
            //accepts an array of objects rather than a single object transaction
            z.array(
                insertTransactionSchema.omit({
                    id: true
                })
            )
        ),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            //not destructuring [] because we are already passing an array
            const data = await db.insert(transactions).values(
                values.map((value) => ({
                    id: createId(),
                    ...value,
                }))
            ).returning()

            return c.json({ data })
        }
    )
    .post(
        "/bulk-delete",
        clerkMiddleware(),
        zValidator (
            "json",
            z.object({
                ids: z.array(z.string())
            })),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            //creates list of id to query inside the data const
            const transactionsToDelete = db.$with("transactions_to_delete").as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(and(
                        inArray(transactions.id, values.ids), //transaction is in the id that is being passed by z.object
                        eq(accounts.userId, auth.userId)
                    ))
            )

            const data = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    //remove transaction that match the transactions id from the list of id's using transactions to delete
                    inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
                )
                .returning({
                    id: transactions.id
                })
            return c.json({ data })
        }
    )
    .patch(
        "/:id",
        clerkMiddleware(),
        // chained zValidators to validate the id and the json object
        zValidator(
            "param", z.object({
                id: z.string().optional()
            })),
        zValidator(
            "json",
            insertTransactionSchema.omit({
                id: true
            })),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")
            const values = c.req.valid("json")

            if(!id) {
                return c.json({ error: "Invalid id" }, 400)
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const transactionsToUpdate = db.$with("transactions_to_update").as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(and(
                        eq(transactions.id, id), //matching transaction id passed from id param above
                        eq(accounts.userId, auth.userId)
                    ))
            )

            // update the account with the new values
            const [data] = await db
                .with(transactionsToUpdate)
                .update(transactions)
                .set(values) //matches with the zValidator above
                .where(
                    inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
                )
                .returning()


            if (!data) {
                return c.json({ error: "Transaction not found" }, 404)
            }
            return c.json({ data })
        }
    )
    .delete(
        "/:id",
        clerkMiddleware(),
        // chained zValidators to validate the id and the json object
        zValidator(
            "param",
            z.object({
                id: z.string().optional()
            })),
        async (c) => {
            const auth = getAuth(c)
            const { id } = c.req.valid("param")

            if(!id) {
                return c.json({ error: "Invalid id" }, 400)
            }

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            //array of ids generated for where query is only transactions user has access to based on the account user id
            const transactionsToDelete = db.$with("transactions_to_delete").as(
                db.select({ id: transactions.id }).from(transactions)
                    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                    .where(and(
                        eq(transactions.id, id), //matching transaction id passed from id param above
                        eq(accounts.userId, auth.userId)
                    ))
            )

            // delete the account and return the id of the deleted account
            const [data] = await db
                .with(transactionsToDelete)
                .delete(transactions)
                .where(
                    inArray(
                        transactions.id,
                        sql`(select id from ${transactionsToDelete})`)
                ).returning({
                    id: transactions.id
                })

            if (!data) {
                return c.json({ error: "Transaction not found" }, 404)
            }
            return c.json({ data })
        }
    )


export default app

