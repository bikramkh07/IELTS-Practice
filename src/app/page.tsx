'use client';
import AppShell from '@/components/AppShell';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';

export default function HomePage() {
  return (
    <AppShell paddingTop="0" minHeight="auto">
      <Hero />
      <HowItWorks />
      <FAQ />
    </AppShell>
  );
}
