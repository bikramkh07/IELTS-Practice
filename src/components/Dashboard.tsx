'use client';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from './Toast';

const DASH_DATA: Record<string, { band: string; sub: string; offset: number }> = {
  overall: { band: '6.5', sub: '+0.5 this month ↑', offset: 68 },
  weekly: { band: '6.0', sub: '+0.5 this week ↑', offset: 102 },
  monthly: { band: '5.5', sub: '30-day baseline', offset: 136 },
};

function Sparkline({ id, data, gradient }: { id: string; data: number[]; gradient: string }) {
  const max = Math.max(...data);
  return (
    <div className="prog-sparkline" id={id}>
      {data.map((v, i) => (
        <div key={i} className="spark-bar" style={{ height: Math.max(4, (v / max) * 40), background: gradient }} />
      ))}
    </div>
  );
}

function StreakRow() {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const states = ['done','done','done','done','done','done','done','done','done','done','done','done','done','done'];
  return (
    <div className="streak-row" id="streakRow">
      {states.map((s, i) => (
        <div key={i} className={`streak-day ${i === 13 ? 'active' : s}`} title={i === 13 ? 'Today' : s === 'done' ? 'Completed' : 'Not started'}>
          {labels[i % 7]}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState('overall');
  const d = DASH_DATA[tab];

  const switchTab = useCallback((t: string) => setTab(t), []);

  return (
    <section className="content-section" id="progress">
      <div className="section-label">Your Dashboard</div>
      <h2 className="section-h2">Track Every Point of Progress</h2>
      <p className="section-sub">Your personal learning command centre. See exactly where you are and what to do next to reach Band 7+.</p>

      <div className="progress-grid">
        <div className="prog-card">
          <div className="prog-label">Current Band</div>
          <div className="prog-val" style={{ color: 'var(--accent3)' }}>6.5</div>
          <div className="prog-note">Target: Band 7.5 · 28 days left</div>
          <Sparkline id="sparkline1" data={[5.0, 5.5, 5.5, 6.0, 6.0, 6.0, 6.5, 6.5]} gradient="linear-gradient(to top, var(--accent), var(--accent3))" />
        </div>
        <div className="prog-card">
          <div className="prog-label">Study Streak</div>
          <div className="prog-val" style={{ color: 'var(--gold)' }}>14 days</div>
          <div className="prog-note">Personal best: 21 days</div>
          <StreakRow />
        </div>
        <div className="prog-card">
          <div className="prog-label">Sessions Done</div>
          <div className="prog-val" style={{ color: 'var(--green)' }}>47</div>
          <div className="prog-note">This month: 12 sessions</div>
          <Sparkline id="sparkline2" data={[2, 4, 3, 5, 4, 6, 5, 7]} gradient="linear-gradient(to top, var(--teal), #5ffff5)" />
        </div>
        <div className="prog-card">
          <div className="prog-label">Vocabulary</div>
          <div className="prog-val" style={{ color: 'var(--teal)' }}>3,240</div>
          <div className="prog-note">Words mastered · +86 this week</div>
          <Sparkline id="sparkline3" data={[80, 120, 90, 150, 130, 180, 160, 220]} gradient="linear-gradient(to top, var(--gold), var(--gold2))" />
        </div>
      </div>

      <div className="dashboard-wrap">
        <div className="dash-header">
          <div className="dash-title"><i className="ti ti-layout-dashboard" style={{ color: 'var(--accent3)' }} /> Band Score Overview</div>
          <div className="dash-tabs">
            {(['overall', 'weekly', 'monthly'] as const).map((t) => (
              <button key={t} className={`dash-tab${tab === t ? ' active' : ''}`} onClick={() => switchTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="dash-body">
          <div>
            <div className="band-score-card">
              <div className="band-ring">
                <svg width="130" height="130" viewBox="0 0 130 130" aria-hidden="true">
                  <defs>
                    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6c63ff" />
                      <stop offset="100%" stopColor="#0dd9c8" />
                    </linearGradient>
                  </defs>
                  <circle className="ring-bg" cx="65" cy="65" r="54" />
                  <circle className="ring-fill" cx="65" cy="65" r="54" style={{ strokeDashoffset: d.offset }} />
                </svg>
                <div className="band-number">{d.band}</div>
              </div>
              <div className="band-label">Overall Band Score</div>
              <div className="band-sub">{d.sub}</div>
            </div>
            <div className="skills-breakdown">
              <div className="skill-item"><div className="skill-name"><i className="ti ti-microphone" style={{ fontSize: 12, color: 'var(--coral)' }} /> Speaking</div><div className="skill-score s-mid">6.5</div><div className="skill-bar"><div className="skill-bar-fill" style={{ width: '81%', background: 'linear-gradient(90deg,var(--coral),#ff8e8e)' }} /></div></div>
              <div className="skill-item"><div className="skill-name"><i className="ti ti-pencil" style={{ fontSize: 12, color: 'var(--accent3)' }} /> Writing</div><div className="skill-score s-low">6.0</div><div className="skill-bar"><div className="skill-bar-fill" style={{ width: '75%', background: 'linear-gradient(90deg,var(--accent),var(--accent3))' }} /></div></div>
              <div className="skill-item"><div className="skill-name"><i className="ti ti-headphones" style={{ fontSize: 12, color: 'var(--teal)' }} /> Listening</div><div className="skill-score s-high">7.0</div><div className="skill-bar"><div className="skill-bar-fill" style={{ width: '87%', background: 'linear-gradient(90deg,var(--teal),#5ffff5)' }} /></div></div>
              <div className="skill-item"><div className="skill-name"><i className="ti ti-book" style={{ fontSize: 12, color: 'var(--gold)' }} /> Reading</div><div className="skill-score s-mid">6.5</div><div className="skill-bar"><div className="skill-bar-fill" style={{ width: '81%', background: 'linear-gradient(90deg,var(--gold),var(--gold2))' }} /></div></div>
            </div>
          </div>
          <div className="activity-panel">
            <div className="activity-card">
              <div className="activity-header">
                <span className="activity-title">Today&apos;s AI Plan</span>
                <span className="badge-ai">AI Generated</span>
              </div>
              <div className="activity-item"><div className="activity-dot done" /><span className="activity-text">Listening: Airport announcements</span><span className="activity-score" style={{ color: 'var(--green)' }}>7.5</span></div>
              <div className="activity-item"><div className="activity-dot done" /><span className="activity-text">Vocabulary: Academic word list</span><span className="activity-score" style={{ color: 'var(--green)' }}>✓</span></div>
              <div className="activity-item"><div className="activity-dot prog" /><span className="activity-text">Writing Task 2 practice</span><span className="activity-score" style={{ color: 'var(--gold)' }}>In progress</span></div>
              <div className="activity-item"><div className="activity-dot todo" /><span className="activity-text">Speaking Part 2 cue card</span><span className="activity-score" style={{ color: 'var(--text3)' }}>Pending</span></div>
              <div className="activity-item"><div className="activity-dot todo" /><span className="activity-text">Reading: True/False/NG practice</span><span className="activity-score" style={{ color: 'var(--text3)' }}>Pending</span></div>
            </div>
            <div className="activity-card">
              <div className="activity-header">
                <span className="activity-title">AI Recommendation</span>
                <i className="ti ti-brain" style={{ fontSize: 16, color: 'var(--accent3)' }} />
              </div>
              <div className="ai-reco-text">
                Focus on Writing Task 2 coherence — your ideas are strong but paragraph linking is limiting your band score. Practice discourse markers daily.
              </div>
              <a className="ai-reco-btn" href="/practice">
                Open Writing Plan →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
