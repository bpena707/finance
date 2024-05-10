import { Hono } from "hono";
import {accounts} from "@/db/schema";

const app = new Hono()

//get all accounts
app.get("/", (c) => {
    return c.json({ accounts: [] })
})

export default app

