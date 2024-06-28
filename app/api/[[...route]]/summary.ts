import { Hono } from "hono"
import {clerkMiddleware, getAuth} from "@hono/clerk-auth";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";
import {differenceInDays, parse, subDays} from "date-fns";

const app = new Hono()
    .get(
        '/',
        clerkMiddleware(),
        zValidator(
            'query',
            z.object({
                from: z.string().optional(),
                to: z.string().optional(),
                accountId: z.string().optional(),
        })
        ),
        async (c) => {
            const auth = getAuth(c)
            const {from, to, accountId} = c.req.valid('query')

            if (!auth) {
                return c.json({error: 'Unauthorized'}, 401)
            }

            const defaultTo = new Date()
            const defaultFrom = subDays(defaultTo, 30)

            const startDate = from ? parse(from, "yyy-MM-dd", new Date()) : defaultFrom

            const endDate = to ? parse(to, "yyy-MM-dd", new Date()) : defaultTo

            const periodLength = differenceInDays(endDate, startDate) + 1
            const lastPeriodDate = subDays(startDate, periodLength)
            const lastPeriodEnd = subDays(endDate, periodLength)

            const currentPeriod =




        }
        )

export default app