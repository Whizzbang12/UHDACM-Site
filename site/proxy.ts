import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { public_env_vars } from "./app/_utils/public_env_vars";

const auth_enabled = public_env_vars.NEXT_PUBLIC_ENABLE_AUTH;

// const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/', '/auth'])
const isPublicRoute = createRouteMatcher([]);

const nothingFunction = (..._: any[]) => {
  // if (auth_enabled) clerkMiddleware(args[0], args[1]);
}

// depending on auth setting, clerk middleware is either clerk's official middleware function, or a function that returns a nothing function.
// this allows the auth to be disabled conditionally.
export const proxy = auth_enabled ? clerkMiddleware(async (auth, req) => {
  // all paths require auth if auth has been enabled.
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
}) : nothingFunction;




export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
