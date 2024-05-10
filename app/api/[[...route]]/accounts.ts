import { Hono } from "hono";
import {accounts} from "@/db/schema";
import {db} from "@/db/drizzle";

const app = new Hono()

//get all accounts
    .get("/", async (c) => {
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

