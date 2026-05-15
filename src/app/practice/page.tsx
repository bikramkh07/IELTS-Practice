'use client';
import { useState } from 'react';
import AppShell from '@/components/AppShell';
import WritingModule from '@/components/WritingModule';
import SpeakingModule from '@/components/SpeakingModule';
import ReadingModule from '@/components/ReadingModule';
import ListeningModule from '@/components/ListeningModule';

const MODULES = ['writing', 'speaking', 'reading', 'listening'] as const;
const MODULE_ICONS: Record<string, string> = {
  writing: 'ti-pencil',
  speaking: 'ti-microphone',
  reading: 'ti-book',
  listening: 'ti-headphones',
};

export default function PracticePage() {
  const [activeModule, setActiveModule] = useState<string>('writing');

  return (
    <AppShell>
      <section className="content-section" id="modules">
        <div className="section-label">Practice Modules</div>
        <h2 className="section-h2">Your Daily AI Examiner</h2>
        <p className="section-sub">
          Choose a module and start practising. Your AI Examiner is ready to evaluate you in real time, 24 hours a day.
        </p>

        <div className="module-tabs" role="tablist">
          {MODULES.map((mod) => (
            <button
              key={mod}
              className={`module-tab${activeModule === mod ? ' active' : ''}`}
              role="tab"
              onClick={() => setActiveModule(mod)}
            >
              <i className={`ti ${MODULE_ICONS[mod]}`} /> {mod.charAt(0).toUpperCase() + mod.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: activeModule === 'writing' ? 'block' : 'none' }}>
          <WritingModule />
        </div>
        <div style={{ display: activeModule === 'speaking' ? 'block' : 'none' }}>
          <SpeakingModule />
        </div>
        <div style={{ display: activeModule === 'reading' ? 'block' : 'none' }}>
          <ReadingModule />
        </div>
        <div style={{ display: activeModule === 'listening' ? 'block' : 'none' }}>
          <ListeningModule />
        </div>
      </section>
    </AppShell>
  );
}
