//this catach all route routes all api routes through hono instead of standard next.js api routes

import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

export const runtime = 'edge';

const app = new Hono().basePath('/api')

//defines get route and returns a json response
app
    .get(
        '/hello',
        clerkMiddleware(),
        (c) => {
            const auth = getAuth(c)
            if (!auth?.userId) {
                return c.json({
                    error: 'unauthenticated',
                })

            }

        return c.json({
            message: 'Hello Next.js!',
            uerId: auth.userId,
        })
    })


//allows hono to use the route handlers
export const GET = handle(app)
export const POST = handle(app)