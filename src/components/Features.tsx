'use client';
import { useEffect, useRef } from 'react';

const FEATURES = [
  { icon: 'ti-microphone', color: 'purple', title: 'AI Speaking Examiner', desc: 'Have real conversations with our AI Examiner for all three speaking parts. Get scored on fluency, coherence, lexical resource, and grammatical range in real time.', tag: 'Real-time AI' },
  { icon: 'ti-pencil', color: 'teal', title: 'Writing Evaluator', desc: 'Submit Task 1 and Task 2 essays and receive band scores across all four IELTS writing criteria within seconds. Detailed improvement suggestions included.', tag: 'Instant Feedback' },
  { icon: 'ti-headphones', color: 'gold', title: 'Listening Practice', desc: 'Access hundreds of authentic listening passages with adaptive difficulty. AI tracks your error patterns and targets your specific weak areas each session.', tag: 'Adaptive' },
  { icon: 'ti-book', color: 'coral', title: 'Reading Modules', desc: 'Academic and General Training passages with time-tracked sessions. AI explains why each answer is correct and builds your reading strategies over time.', tag: 'Explained Answers' },
  { icon: 'ti-chart-line', color: 'green', title: 'Progress Analytics', desc: 'Track your band score journey with detailed analytics. Get AI-generated study plans based on your current level, target score, and Exams date.', tag: 'Smart Plans' },
  { icon: 'ti-clipboard-check', color: 'purple', title: 'Full Mock Tests', desc: 'Simulate the real IELTS experience with timed, full-length tests. Receive a complete score breakdown with Examiner-style commentary after every mock.', tag: 'Exam-Ready' },
];

export default function Features() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || !gridRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('style', `${entry.target.getAttribute('style') || ''} animation-play-state: running; opacity: 1;`);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    gridRef.current.querySelectorAll('.feat-card').forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.animation = `fadeSlideUp 0.5s ${i * 0.08}s ease both`;
      (el as HTMLElement).style.animationPlayState = 'paused';
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="content-section" id="features">
      <div className="section-label">What We Offer</div>
      <h2 className="section-h2">Everything You Need for Band 7+</h2>
      <p className="section-sub">
        An AI-powered IELTS academy that adapts to your weaknesses and gets you Exams-ready in weeks, not months.
      </p>
      <div className="features-grid" ref={gridRef}>
        {FEATURES.map((f) => (
          <div className="feat-card" key={f.title}>
            <div className={`feat-icon ${f.color}`}>
              <i className={`ti ${f.icon}`} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <span className="feat-tag">{f.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
