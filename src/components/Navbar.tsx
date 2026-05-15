'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ClerkAuthNav from '@/components/ClerkAuthNav';
import { hasClerk } from '@/lib/clerk-config';

const NAV_ITEMS = [
  { href: '/features', label: 'Features' },
  { href: '/practice', label: 'Practice' },
  { href: '/mock-test', label: 'Mock Test' },
  { href: '/progress', label: 'Progress' },
  { href: '/reviews', label: 'Reviews' },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <Link href="/" className="nav-logo">IELTS UP</Link>
        <button
          className="nav-hamburger"
          id="hamburger"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <i className={mobileOpen ? 'ti ti-x' : 'ti ti-menu-2'} />
        </button>
        <div className={`nav-links${mobileOpen ? ' open' : ''}`} id="navLinks">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? 'nav-link-active' : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-cta">
          {hasClerk ? (
            <ClerkAuthNav />
          ) : (
            <>
              <Link href="/sign-in" className="btn-ghost">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
      <div
        className={`mobile-overlay${mobileOpen ? ' visible' : ''}`}
        id="mobileOverlay"
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
}
