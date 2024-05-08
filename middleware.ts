import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// helper function that Creates a route matcher for protected routes
//accepts an array of strings that represent the protected routes
const isProtectedRoute = createRouteMatcher([
    '/', //this protects the root route
]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect(); //if the route req is protected, protect it using auth().protect()
    return NextResponse.next(); //otherwise return the next response
});

//catches every route except for the static assets
export const config = {
    matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};