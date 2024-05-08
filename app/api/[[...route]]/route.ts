//this catach all route routes all api routes through hono instead of standard next.js api routes

import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge';

const app = new Hono().basePath('/api')

//defines get route and returns a json response
app.get('/hello', (c) => {
    return c.json({
        message: 'Hello Next.js!',
    })
})

//allows hono to use the route handlers
export const GET = handle(app)
export const POST = handle(app)