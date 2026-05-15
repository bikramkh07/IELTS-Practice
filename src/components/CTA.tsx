'use client';
import { useToast } from './Toast';

export default function CTA() {
  const { showToast } = useToast();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="cta-section" id="cta">
      <div className="cta-inner">
        <div className="cta-badge">
          <span className="dot" /> 100% Free — Start Anytime
        </div>
        <h2 className="cta-h2">
          Your Band 7+ Journey
          <br />
          Starts Right Now
        </h2>
        <p className="cta-sub">
          Practice IELTS - Speaking, Reading, Listening, Writing with AI tutor. Create your free account in 30 seconds.
        </p>
        <div className="cta-actions">
          <button className="btn-hero" onClick={() => showToast('Welcome to IELTS UP! Setting up your profile... 🎯')}>
            <i className="ti ti-rocket" /> Start Practicing
          </button>
          <button className="btn-hero-outline" onClick={() => scrollTo('modules')}>
            <i className="ti ti-eye" /> Try Demo First
          </button>
        </div>
        <div className="cta-trust">
          <span><i className="ti ti-shield-check" style={{ color: 'var(--green)' }} /> Always free</span>
          <span><i className="ti ti-clock" style={{ color: 'var(--teal)' }} /> Ready in 30 seconds</span>
          <span><i className="ti ti-star" style={{ color: 'var(--gold)' }} /> 4.9 star rating</span>
        </div>
      </div>
    </div>
  );
}
