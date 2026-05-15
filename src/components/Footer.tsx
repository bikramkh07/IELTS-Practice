'use client';
import Link from 'next/link';
import { useToast } from './Toast';

export default function Footer() {
  const { showToast } = useToast();

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">IELTS UP</div>
          <p className="footer-tagline">
            AI-powered IELTS preparation for the next generation of global citizens. Designed for Nepali students targeting Band 7+.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter" onClick={() => showToast('Follow us on Twitter!')}><i className="ti ti-brand-twitter" /></a>
            <a href="#" aria-label="Instagram" onClick={() => showToast('Follow us on Instagram!')}><i className="ti ti-brand-instagram" /></a>
            <a href="#" aria-label="YouTube" onClick={() => showToast('Subscribe on YouTube!')}><i className="ti ti-brand-youtube" /></a>
            <a href="#" aria-label="Facebook" onClick={() => showToast('Join us on Facebook!')}><i className="ti ti-brand-facebook" /></a>
          </div>
        </div>
        <div className="footer-links-grid">
          <div className="footer-col">
            <div className="footer-col-title">Practice</div>
            <Link href="/practice">Writing</Link>
            <Link href="/practice">Speaking</Link>
            <Link href="/practice">Reading</Link>
            <Link href="/practice">Listening</Link>
            <Link href="/mock-test">Mock Test</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Resources</div>
            <a href="#" onClick={() => showToast('Opening vocabulary builder...')}>Vocabulary Builder</a>
            <a href="#" onClick={() => showToast('Opening grammar guide...')}>Grammar Guide</a>
            <a href="#" onClick={() => showToast('Opening band descriptors...')}>Band Descriptors</a>
            <a href="#" onClick={() => showToast('Opening study plans...')}>Study Plans</a>
            <a href="#" onClick={() => showToast('Opening blog...')}>IELTS Blog</a>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Support</div>
            <a href="#" onClick={() => showToast('Opening FAQ...')}>FAQ</a>
            <a href="#" onClick={() => showToast('Opening help centre...')}>Help Centre</a>
            <a href="#" onClick={() => showToast('Opening contact form...')}>Contact Us</a>
            <a href="#" onClick={() => showToast('Opening community forum...')}>Community</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-text">© 2025 IELTS UP · All rights reserved</div>
        <div className="footer-bottom-links">
          <a href="#" onClick={() => showToast('Privacy Policy...')}>Privacy Policy</a>
          <a href="#" onClick={() => showToast('Terms of Service...')}>Terms of Service</a>
          <a href="#" onClick={() => showToast('Cookie Settings...')}>Cookies</a>
        </div>
        <div className="footer-tech">Built by BIKKHA</div>
      </div>
    </footer>
  );
}
