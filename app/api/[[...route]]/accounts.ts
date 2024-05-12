import { Hono } from "hono";
import {accounts, insertAccountSchema,} from "@/db/schema";
import {db} from "@/db/drizzle";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import {eq} from "drizzle-orm";
import {zValidator} from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2"

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
                id:accounts.id,
                name:accounts.name,
            })
            .from(accounts)
            // where is used to only show the accounts that belong to the user
            .where(eq(accounts.userId, auth.userId))

        return c.json({ data })
    })
    .post(
        '/',
        clerkMiddleware(),
        // uses the insert account schema but only certain fields are passed to the front end
        zValidator('json', insertAccountSchema.pick({
            name: true,

        })),
        async (c) => {
            const auth = getAuth(c)
            const values = c.req.valid("json")

            if (!auth?.userId) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const [data] = await db.insert(accounts).values({
                id: createId(),
                userId: auth.userId,
                ...values,
            }).returning()

            return c.json({ data })
        }
    )

export default app

