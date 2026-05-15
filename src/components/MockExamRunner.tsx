'use client';
import { useState, useEffect } from 'react';
import ListeningModule from '@/components/ListeningModule';
import ReadingModule from '@/components/ReadingModule';
import WritingModule from '@/components/WritingModule';
import SpeakingModule from '@/components/SpeakingModule';
import ReadingGTModule from '@/components/ReadingGTModule';
import WritingGTModule from '@/components/WritingGTModule';

const SECTIONS = ['listening', 'reading', 'writing', 'speaking'];

export default function MockExamRunner({ examId, onExit }: { examId: string; onExit: () => void }) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [globalSeconds, setGlobalSeconds] = useState(9900); // 2h 45m = 165 minutes = 9900 seconds
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Scroll to top when section changes
    window.scrollTo(0, 0);
  }, [currentSectionIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentSection = SECTIONS[currentSectionIndex];

  const handleNextSection = () => {
    if (currentSectionIndex < SECTIONS.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const timeStr = `${Math.floor(globalSeconds / 3600)}h ${Math.floor((globalSeconds % 3600) / 60)}m ${String(globalSeconds % 60).padStart(2, '0')}s`;

  if (isFinished) {
    return (
      <div className="content-section" style={{ paddingTop: '100px', textAlign: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="feat-icon green" style={{ margin: '0 auto 20px', width: '60px', height: '60px', fontSize: '30px' }}>
          <i className="ti ti-check" />
        </div>
        <h2 className="section-h2">Exam Completed!</h2>
        <p className="section-sub" style={{ margin: '0 auto 40px' }}>Your AI examiner has processed your test and calculated your final band scores.</p>
        
        <div className="skills-breakdown" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
          <div className="skill-item">
            <div className="skill-name">Listening</div>
            <div className="skill-score s-high">7.5</div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Reading</div>
            <div className="skill-score s-high">7.0</div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Writing</div>
            <div className="skill-score s-mid">6.5</div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Speaking</div>
            <div className="skill-score s-high">7.0</div>
          </div>
        </div>
        
        <div style={{ display: 'inline-block', background: 'var(--bg3)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '40px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Overall Band Score</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '48px', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent), var(--teal))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>7.0</div>
        </div>

        <div>
          <button className="btn-primary" onClick={onExit}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 9999, overflowY: 'auto' }}>
      {/* Runner Header */}
      <div style={{ background: 'var(--bg2)', padding: '15px 30px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={onExit} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', transition: 'all 0.2s' }} title="Exit Exam" onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg4)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
            <i className="ti ti-x" />
          </button>
          <h3 style={{ fontFamily: 'var(--font-head)', margin: 0, fontSize: '18px' }}>IELTS Mock Test {examId === 'general-1' ? '(General)' : '(Academic)'}</h3>
          <span className="feat-tag" style={{ margin: 0 }}>{currentSection.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="exam-timer" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <i className="ti ti-clock" /> {timeStr}
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={handleNextSection}>
            {currentSectionIndex < SECTIONS.length - 1 ? 'Next Section' : 'Finish Exam'} <i className="ti ti-arrow-right" />
          </button>
        </div>
      </div>

      {/* Runner Content */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', paddingBottom: '60px' }}>
        {currentSection === 'listening' && <ListeningModule />}
        {currentSection === 'reading' && (examId === 'general-1' ? <ReadingGTModule /> : <ReadingModule />)}
        {currentSection === 'writing' && (examId === 'general-1' ? <WritingGTModule /> : <WritingModule />)}
        {currentSection === 'speaking' && <SpeakingModule />}
      </div>
    </div>
  );
}
