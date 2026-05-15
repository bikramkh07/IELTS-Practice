import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { hasClerk } from '@/lib/clerk-config';

export default function SignUpPage() {
  if (!hasClerk) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#05060a',
          color: '#f0f2ff',
          padding: '2rem',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem' }}>Sign-up not configured</h1>
        <p style={{ opacity: 0.8, maxWidth: 420 }}>
          Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{' '}
          <code>CLERK_SECRET_KEY</code> in your Vercel project environment variables, then
          redeploy.
        </p>
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#05060a',
      }}
    >
      <SignUp afterSignUpUrl="/" />
    </div>
  );
}
