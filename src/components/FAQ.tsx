'use client';
import { useState } from 'react';

const FAQS = [
  { q: 'How accurate is the AI band scoring?', a: 'Our AI evaluator is trained on thousands of real IELTS essays and speaking samples, calibrated to official Cambridge band descriptors. In blind testing, our AI scores align with human Examiners within ±0.5 bands over 94% of the time — comparable to inter-rater reliability between human Examiners themselves.' },
  { q: 'Can I use IELTS UP on my phone?', a: 'Yes. IELTS UP is fully responsive and works on all devices. It also supports PWA installation — you can add it to your home screen on both Android and iOS for an app-like experience with offline access to vocabulary and study materials.' },
  { q: 'Is IELTS UP suitable for General Training IELTS?', a: 'Absolutely. IELTS UP covers both Academic and General Training formats for Reading and Writing. All modules let you select your test type, and the AI evaluator applies the correct band descriptors for your specific test version.' },
  { q: 'How is IELTS UP different from other IELTS apps?', a: 'Most IELTS apps give you practice materials and tell you if an answer is right or wrong. IELTS UP gives you a real AI Examiner experience — open-ended writing evaluation, conversational speaking assessment, adaptive difficulty, and a personalised improvement plan that updates every week based on your performance data.' },
  { q: 'How long does it take to reach Band 7?', a: 'This varies by starting level. Students starting at Band 5–5.5 typically reach Band 7 in 8–12 weeks with consistent daily practice of 45–60 minutes. Students starting at Band 6 often reach Band 7 in 4–6 weeks. Our AI diagnostic gives you a personalised timeline on day one.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="content-section" id="faq">
      <div className="section-label">Common Questions</div>
      <h2 className="section-h2">Frequently Asked Questions</h2>
      <p className="section-sub">Everything you need to know about IELTS UP.</p>
      <div className="faq-list">
        {FAQS.map((f, i) => (
          <div
            key={i}
            className={`faq-item${openIndex === i ? ' open' : ''}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="faq-question">
              {f.q} <i className="ti ti-chevron-down faq-icon" />
            </div>
            <div className="faq-answer">{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
