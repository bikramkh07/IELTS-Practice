'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function ClerkAuthNav() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button type="button" className="btn-ghost">
            Sign In
          </button>
        </SignInButton>
        <Link href="/sign-up" className="btn-primary">
          Get Started
        </Link>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
}
