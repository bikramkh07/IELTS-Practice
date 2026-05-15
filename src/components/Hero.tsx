'use client';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="hero-grid" />
      </div>
      <div className="hero-inner">
        <div className="hero-badge">
          <span className="dot" />
          100% Free — Start Anytime
        </div>
        <h1 className="hero-h1">
          Your Band 7+ Journey
          <br />
          Starts Right Now
        </h1>
        <p className="hero-sub">
          Practice IELTS - Speaking, Reading, Listening, Writing with AI tutor. Create your free account in 30 seconds.
        </p>
        <div className="hero-actions">
          <Link href="/practice" className="btn-hero">
            <i className="ti ti-rocket" /> Start Practicing
          </Link>
          <Link href="/mock-test" className="btn-hero-outline">
            <i className="ti ti-clipboard-check" /> Take Mock Test
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-val">50K+</div>
            <div className="hero-stat-lab">Students enrolled</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-val">91%</div>
            <div className="hero-stat-lab">Achieve Band 7+</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-val">2.4M+</div>
            <div className="hero-stat-lab">Practice sessions</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-val">4.9★</div>
            <div className="hero-stat-lab">Average rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
