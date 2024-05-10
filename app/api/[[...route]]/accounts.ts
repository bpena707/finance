import { Hono } from "hono";
import {accounts} from "@/db/schema";
import {db} from "@/db/drizzle";
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";

const app = new Hono()

//get all accounts as long as the user is authenticated if not then throw an error
    .get(
        "/",
        clerkMiddleware(),
        async (c) => {
            const auth = getAuth(c)

            if (!auth?.userId) {
                throw new HTTPException(401, {
                    res: c.json({ error: "Unauthorized" }, 401)
                })
            }

        const data = await db
            // select is used for security by only allowing id and name to display in front end
            .select({
                id:accounts.id,
                name:accounts.name,
            })
            .from(accounts)

        return c.json({ data })
    })

export default app

