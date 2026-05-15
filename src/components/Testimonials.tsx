'use client';
import { useEffect, useRef } from 'react';

const TESTIMONIALS = [
  { initials: 'SA', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', name: 'Srijana Adhikari', band: '7.5', loc: 'Kathmandu, Nepal · Canada immigration', text: '"I improved from 5.5 to 7.5 in just 6 weeks. The AI writing feedback was incredible — it caught mistakes I didn\'t even know I was making. The speaking Examiner felt just like the real test."' },
  { initials: 'BG', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', name: 'Bibek Gurung', band: '7.0', loc: 'Pokhara, Nepal · UK university', text: '"The daily AI practice sessions kept me consistent. The progress tracking showed me exactly where I was losing points. Got Band 7 for university admission in the UK after 2 months."' },
  { initials: 'AT', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', name: 'Anisha Tamang', band: '7.5', loc: 'Lalitpur, Nepal · Australian PR', text: '"I was stuck at Band 6 for over a year. IELTS UP identified that my writing coherence was the specific problem. The targeted exercises pushed me to Band 7.5 in Writing."' },
  { initials: 'RS', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', name: 'Roshan Shrestha', band: '7.0', loc: 'Bhaktapur, Nepal · Canada study visa', text: '"The mock Exams simulator is unbelievably accurate. After three full mocks on IELTS UP, the actual IELTS felt familiar. The listening section especially — same style, same difficulty."' },
  { initials: 'KM', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', name: 'Kriti Magar', band: '7.5', loc: 'Chitwan, Nepal · UK Masters programme', text: '"What I love most is the instant feedback after each writing task. It doesn\'t just give you a score — it tells you exactly what to fix, with Examsples. That level of detail changed everything."' },
  { initials: 'DR', gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', name: 'Dipesh Rai', band: '7.0', loc: 'Biratnagar, Nepal · New Zealand work visa', text: '"As a working professional, I couldn\'t attend classes. IELTS UP let me practice at 11pm after work. The 24/7 availability and the quality of AI feedback was exactly what I needed."' },
];

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || !gridRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.animationPlayState = 'running';
          (e.target as HTMLElement).style.opacity = '1';
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
    gridRef.current.querySelectorAll('.testi-card').forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.animation = `fadeSlideUp 0.5s ${i * 0.06}s ease both`;
      (el as HTMLElement).style.animationPlayState = 'paused';
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="content-section" style={{ maxWidth: 1200, paddingTop: 80, paddingBottom: 80 }}>
        <div className="section-label">Success Stories</div>
        <h2 className="section-h2">Students Who Achieved Band 7+</h2>
        <p className="section-sub" style={{ marginBottom: 40 }}>
          Real results from real students across Nepal who trusted IELTS UP for their IELTS journey.
        </p>
        <div className="testi-grid" ref={gridRef}>
          {TESTIMONIALS.map((t) => (
            <div className="testi-card" key={t.name}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: t.gradient }}>{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name} <span className="testi-band">Band {t.band}</span></div>
                  <div className="testi-info">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
