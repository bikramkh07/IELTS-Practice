'use client';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import MockExamRunner from '@/components/MockExamRunner';
import { ToastProvider } from '@/components/Toast';

export default function MockTestPage() {
  const [activeExam, setActiveExam] = useState<string | null>(null);

  if (activeExam) {
    return (
      <ToastProvider>
        <MockExamRunner examId={activeExam} onExit={() => setActiveExam(null)} />
      </ToastProvider>
    );
  }

  return (
    <AppShell paddingTop="120px">
      <section className="content-section">
        <div className="section-label">Full Length Tests</div>
        <h2 className="section-h2">IELTS Mock Test</h2>
        <p className="section-sub">
          Experience the real test environment. Complete all four sections in one sitting to get a highly accurate band score prediction from your AI examiner.
        </p>

        <div className="features-grid">
          <div className="feat-card">
            <div className="feat-icon purple"><i className="ti ti-file-certificate" /></div>
            <h3>Academic Full Test 1</h3>
            <p>Standard Academic IELTS format. Listening, Reading (Academic), Writing (Academic), and Speaking.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <span className="feat-tag"><i className="ti ti-clock" /> 2h 45m</span>
              <span className="feat-tag" style={{ background: 'rgba(13,217,200,0.1)', color: 'var(--teal)' }}>New</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setActiveExam('academic-1')}>
              Start Test
            </button>
          </div>

          <div className="feat-card">
            <div className="feat-icon gold"><i className="ti ti-file-text" /></div>
            <h3>General Training Full Test 1</h3>
            <p>General Training format. Features workplace-oriented reading and letter writing tasks.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <span className="feat-tag"><i className="ti ti-clock" /> 2h 45m</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setActiveExam('general-1')}>
              Start Test
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
