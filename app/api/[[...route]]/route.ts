//this catach all route routes all api routes through hono instead of standard next.js api routes

import {Hono} from 'hono'
import {handle} from 'hono/vercel'

import accounts from "@/app/api/[[...route]]/accounts";
import categories from "@/app/api/[[...route]]/categories";
import transactions from "@/app/api/[[...route]]/transactions";

export const runtime = 'edge';

const app = new Hono().basePath('/api')

const routes = app
    .route('/accounts', accounts)
    .route('/categories', categories)
    .route('/transactions', transactions)


//allows hono to use the route handlers
export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

//to generate the rpc type
export type AppType = typeof routes