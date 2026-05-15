import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Syne, DM_Sans, Outfit } from 'next/font/google';
import { clerkPublishableKey, hasClerk } from '@/lib/clerk-config';
import './globals.css';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'IELTS UP — AI-Powered IELTS Band 7+ Academy',
  description:
    'AI-powered IELTS preparation platform. Practice speaking, writing, reading and listening with your personal AI Examiner — available 24/7.',
};

const clerkAppearance = {
  variables: {
    colorPrimary: '#6c63ff',
    colorBackground: '#0d0f16',
    colorText: '#f0f2ff',
    colorInputBackground: '#13161f',
    colorInputText: '#f0f2ff',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const html = (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${outfit.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>{children}</body>
    </html>
  );

  if (!hasClerk) return html;

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={clerkAppearance}>
      {html}
    </ClerkProvider>
  );
}
