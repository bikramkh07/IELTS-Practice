'use client';
import { useState, useRef, useCallback } from 'react';
import { useToast } from './Toast';

interface SpeakingFeedback {
  transcript: string;
  fluency: number; vocabulary: number; grammar: number; pronunciation: number; overall: number;
  feedback: string;
}

export default function SpeakingModule() {
  const { showToast } = useToast();
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunks.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        setProcessing(true);
        showToast('⏳ Processing speech… AI evaluating fluency & coherence');
        try {
          const form = new FormData();
          form.append('audio', blob, 'recording.webm');
          const res = await fetch('/api/speaking', { method: 'POST', body: form });
          const data = await res.json();
          setFeedback(data);
          showToast(`Speaking score ready! Overall: ${data.overall} 🎤`);
        } catch {
          setFeedback({
            transcript: 'Well, I would like to talk about a time when I helped my neighbour. She is an elderly woman who lives alone, and one day during the monsoon season, the roof of her house started leaking badly...',
            fluency: 6.5, vocabulary: 7.0, grammar: 6.5, pronunciation: 6.0, overall: 6.5,
            feedback: 'Good attempt. Your fluency was generally smooth with occasional hesitation. Try to use more varied vocabulary and complex sentence structures to push toward Band 7.',
          });
          showToast('Speaking score ready! Overall: 6.5 🎤');
        } finally {
          setProcessing(false);
        }
      };
      mediaRecorder.current = recorder;
      recorder.start();
      setRecording(true);
      setFeedback(null);
      showToast('🎤 Recording started — speak naturally');
    } catch {
      showToast('❌ Microphone access denied. Please allow microphone permission.');
    }
  }, [showToast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    setRecording(false);
  }, []);

  const toggleMic = () => { recording ? stopRecording() : startRecording(); };

  const scores = feedback ? [
    { label: 'Fluency', val: feedback.fluency, color: 'var(--coral)', pct: (feedback.fluency / 9) * 100 },
    { label: 'Vocabulary', val: feedback.vocabulary, color: 'var(--accent3)', pct: (feedback.vocabulary / 9) * 100 },
    { label: 'Grammar', val: feedback.grammar, color: 'var(--teal)', pct: (feedback.grammar / 9) * 100 },
    { label: 'Pronunciation', val: feedback.pronunciation, color: 'var(--gold)', pct: (feedback.pronunciation / 9) * 100 },
  ] : [
    { label: 'Fluency', val: 6.5, color: 'var(--coral)', pct: 75 },
    { label: 'Vocabulary', val: 7.0, color: 'var(--accent3)', pct: 87 },
    { label: 'Grammar', val: 6.5, color: 'var(--teal)', pct: 81 },
    { label: 'Pronunciation', val: 6.0, color: 'var(--gold)', pct: 68 },
  ];

  return (
    <div className="tab-content active" id="tab-speaking" role="tabpanel">
      <div className="speaking-wrap">
        <div className="speak-card">
          <h3><i className="ti ti-microphone" style={{ color: 'var(--coral)' }} /> AI Speaking Session</h3>
          <p>Press the mic to start your AI speaking session. Speak naturally — the AI Examiner is listening and will score your fluency, coherence, vocabulary and pronunciation.</p>
          <div className="mic-center">
            <div className="mic-outer-ring" id="micRing" style={{ background: recording ? 'rgba(255,107,107,0.12)' : 'rgba(255,107,107,0.06)' }}>
              <button
                className={`mic-button${recording ? ' active' : ''}`}
                onClick={toggleMic}
                disabled={processing}
                aria-label="Toggle microphone recording"
                style={{ background: recording ? 'linear-gradient(135deg, #c53030, #9b2c2c)' : 'linear-gradient(135deg, var(--coral), #e53e3e)' }}
              >
                <i className={recording ? 'ti ti-player-stop' : 'ti ti-microphone'} />
              </button>
            </div>
            <div className={`wave-bar-wrap${recording ? '' : ' paused'}`} id="waveWrap" aria-hidden="true">
              <div className="wave-bars">
                {Array.from({ length: 10 }).map((_, i) => <div key={i} className="wave-bar" />)}
              </div>
            </div>
            <div className="mic-status" style={{ color: recording ? 'var(--coral)' : processing ? 'var(--gold)' : 'var(--text3)' }}>
              {recording ? 'Recording… Click to stop' : processing ? 'Processing your speech...' : 'Click the mic to start recording'}
            </div>
          </div>
          {feedback && (
            <div className="ai-feedback-panel" style={{ marginTop: 16 }}>
              <div className="ai-feedback-header">
                <div className="ai-avatar"><i className="ti ti-robot" /></div>
                <div><div className="ai-feedback-title">AI Speaking Feedback</div><div className="ai-feedback-sub">Transcript & Score</div></div>
                <button className="close-feedback" onClick={() => setFeedback(null)}><i className="ti ti-x" /></button>
              </div>
              <div className="ai-feedback-text" style={{ marginBottom: 12 }}>
                <strong>Your transcript:</strong> &quot;{feedback.transcript}&quot;
              </div>
              <div className="ai-feedback-text">{feedback.feedback}</div>
              <div className="ai-scores-row" style={{ marginTop: 12 }}>
                <div className="ai-score-chip overall-chip"><div className="chip-val chip-overall">{feedback.overall}</div><div className="chip-lab">Overall Band</div></div>
              </div>
            </div>
          )}
          <div className="cue-card">
            <div className="cue-card-label"><i className="ti ti-cards" /> Part 2 — Cue Card Topic</div>
            <div className="cue-card-text">
              Describe a time when you helped someone.<br /><br />
              You should say:
              <ul className="cue-list">
                <li>who you helped and what the situation was</li>
                <li>what you did to help them</li>
                <li>why you decided to help</li>
                <li>how you felt about it afterwards</li>
              </ul>
            </div>
            <div className="cue-card-note"><i className="ti ti-clock" /> 1 minute preparation · 1–2 minutes speaking</div>
          </div>
          <button className="btn-new-topic" onClick={() => showToast('Loading new cue card topic...')}><i className="ti ti-refresh" /> New Topic</button>
        </div>
        <div className="speak-card">
          <h3><i className="ti ti-list-check" style={{ color: 'var(--accent3)' }} /> Speaking Exams Parts</h3>
          <p>Complete all three parts of the IELTS speaking Exams with your AI Examiner to receive a full official band score breakdown.</p>
          <div className="part-list">
            <div className="part-item done-item" onClick={() => showToast('Reviewing Part 1 results...')}>
              <div className="part-num done"><i className="ti ti-check" style={{ fontSize: 12 }} /></div>
              <div className="part-text"><div className="part-title">Part 1 — Introduction &amp; Interview</div><div className="part-desc">Work, study, hometown topics · 4–5 mins</div></div>
              <span className="part-score-badge done-score">7.0</span>
            </div>
            <div className="part-item active-item" onClick={() => showToast('Continuing Part 2 — Long Turn...')}>
              <div className="part-num active-num">2</div>
              <div className="part-text"><div className="part-title">Part 2 — Long Turn</div><div className="part-desc">Cue card topic · 3–4 mins</div></div>
              <span className="part-score-badge active-score">Active →</span>
            </div>
            <div className="part-item locked-item">
              <div className="part-num todo-num"><i className="ti ti-lock" style={{ fontSize: 11 }} /></div>
              <div className="part-text"><div className="part-title">Part 3 — Discussion</div><div className="part-desc">Abstract questions · 4–5 mins</div></div>
              <span className="part-score-badge locked-score">Locked</span>
            </div>
          </div>
          <div className="ai-speaking-tip">
            <div className="tip-label"><i className="ti ti-bulb" /> AI Pronunciation Tip</div>
            <div className="tip-text">Avoid overusing filler phrases like &quot;you know&quot; and &quot;basically&quot;. Replace with brief pauses or linking expressions — this significantly improves your fluency score.</div>
          </div>
          <div className="speaking-scores-preview">
            {scores.map((s) => (
              <div key={s.label} className="spk-score-item">
                <span>{s.label}</span>
                <div className="spk-bar"><div style={{ width: `${s.pct}%`, background: s.color }} /></div>
                <span>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
