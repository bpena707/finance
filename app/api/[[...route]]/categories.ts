//this is where all the api requests for accounts are handled

import {Hono} from "hono";
import {categories, insertCategorySchema,} from "@/db/schema";
import {db} from "@/db/drizzle";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import {and, eq, inArray} from "drizzle-orm";
import {zValidator} from "@hono/zod-validator";
import {createId} from "@paralleldrive/cuid2"
import {z} from "zod";

const app = new Hono()

//get all accounts as long as the user is authenticated if not then throw an error
    .get(
        "/",
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c)

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

        const data = await db
            // select is used for security by only allowing id and name to display in front end
            .select({
                id:categories.id,
                name:categories.name,
            })
            .from(categories)
            // where is used to only show the accounts that belong to the user
            .where(eq(categories.userId, auth.userId))

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
                    id: categories.id,
                    name: categories.name,
                })
                .from(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
            if (!data) {
                return c.json({ error: "Account not found" }, 404)
            }

            return c.json({ data })
        }
    )
    .post(
        '/',
        clerkMiddleware(),
        // uses the insert account schema but only certain fields are passed to the front end
        zValidator('json', insertCategorySchema.pick({
            name: true,
        })),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const [data] = await db.insert(categories).values({
                id: createId(),
                userId: auth.userId,
                ...values,
            }).returning()

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

            const data = await db
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId), //ensure user can only delete their own accounts
                        inArray(categories.id, values.ids) //ensure only accounts that exist are deleted
                    )
                )
                .returning({
                    id: categories.id
                })
            return c.json({ data })
        }
    )
    .patch(
        "/:id",
        clerkMiddleware(),
        // chained zValidators to validate the id and the json object
        zValidator(
            "param",
            z.object({
                id: z.string().optional()
            })),
        zValidator(
            "json",
            insertCategorySchema.pick({
                name: true
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

            // update the account with the new values
            const [data] = await db
                .update(categories)
                .set(values)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
                .returning()

            if (!data) {
                return c.json({ error: "Account not found" }, 404)
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

            // delete the account and return the id of the deleted account
            const [data] = await db
                .delete(categories)
                .where(
                    and(
                        eq(categories.userId, auth.userId),
                        eq(categories.id, id)
                    )
                )
                .returning({
                    id: categories.id
                })

            if (!data) {
                return c.json({ error: "Account not found" }, 404)
            }
            return c.json({ data })
        }
    )


export default app

