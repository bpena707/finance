//this catach all route routes all api routes through hono instead of standard next.js api routes

import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import accounts from "@/app/api/[[...route]]/accounts";

export const runtime = 'edge';

const app = new Hono().basePath('/api')

const routes = app
    .route('/accounts', accounts)


//allows hono to use the route handlers
export const GET = handle(app)
export const POST = handle(app)

//to generate the rpc type
export type AppType = typeof routes