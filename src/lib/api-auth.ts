import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { hasClerk } from '@/lib/clerk-config';
import { prisma } from '@/lib/prisma';

/** Returns Clerk user id, or null if auth is not configured. */
export async function requireAuth(): Promise<
  { userId: string } | { error: NextResponse }
> {
  if (!hasClerk) {
    return { userId: 'anonymous' };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      error: NextResponse.json({ error: 'Sign in required' }, { status: 401 }),
    };
  }

  return { userId };
}

/** Ensures a Prisma User row exists for the signed-in Clerk user. */
export async function ensureDbUser(clerkId: string) {
  const clerkUser = await currentUser();
  const email =
    clerkUser?.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress ??
    `${clerkId}@clerk.local`;

  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, email, name: clerkUser?.fullName ?? null },
    update: {
      email,
      name: clerkUser?.fullName ?? null,
    },
  });
}
