import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { hasClerk } from '@/lib/clerk-config';

const isProtectedApi = createRouteMatcher([
  '/api/writing(.*)',
  '/api/speaking(.*)',
  '/api/scores(.*)',
]);

export default hasClerk
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedApi(req)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
