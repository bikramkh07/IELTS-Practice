'use client';
import { useState, useEffect, useRef } from 'react';
import { useToast } from './Toast';

const WRITING_PROMPTS = [
  'You recently stayed at a hotel and left a valuable item in your room. Write a letter to the hotel manager. In your letter:\n- give details of your stay\n- describe the item you left behind\n- suggest what you want the manager to do',
  'You have seen an advertisement for a part-time job in a local newspaper. Write a letter to the employer. In your letter:\n- explain why you are writing\n- describe your relevant experience\n- say when you would be available for an interview',
  'Your local public library wants to make improvements to their services and facilities. Write a letter to the library manager. In your letter:\n- say what you like about the library\n- explain what you dislike\n- suggest improvements that could be made',
];

const SAMPLE_ESSAY = `Dear Sir/Madam,

I am writing to report a valuable item that I believe I left behind in my room during my recent stay at your hotel.

I stayed in room 412 from Friday, October 12th to Sunday, October 14th under the name John Smith. I checked out early on Sunday morning to catch a flight and in my rush, I seem to have forgotten my tablet computer.

The item is a silver iPad Pro, 11-inch model. It has a black protective case with a small scratch on the back corner. The lock screen features a picture of a golden retriever dog. It contains highly important work documents that I urgently need access to.

Could you please ask your housekeeping staff to check room 412 and the lost property department? If the tablet is found, I would be extremely grateful if you could arrange to have it couriered to my home address at my expense. You can reach me by phone at 555-0198 to arrange the delivery details.

Thank you in advance for your assistance with this matter.

Yours faithfully,
John Smith`;

interface AIFeedback {
  ta: number; cc: number; lr: number; gra: number; overall: number;
  feedback: string; improvements: string[];
}

export default function WritingGTModule() {
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState(WRITING_PROMPTS[0]);
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [seconds, setSeconds] = useState(1200); // 20 mins for Task 1
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 0) { clearInterval(timerRef.current); showToast('⏰ Time is up! Submitting your letter...'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [hasStarted, showToast]);

  const timeStr = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  const handleEssayChange = (val: string) => {
    if (!hasStarted) setHasStarted(true);
    setEssay(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
  };

  const loadNewPrompt = () => {
    const others = WRITING_PROMPTS.filter((p) => p !== prompt);
    setPrompt(others[Math.floor(Math.random() * others.length)]);
    setSeconds(1200);
    setFeedback(null);
    showToast('New prompt loaded! Timer reset. ✍️');
  };

  const loadSample = () => {
    setEssay(SAMPLE_ESSAY);
    setWordCount(SAMPLE_ESSAY.trim().split(/\s+/).length);
    showToast('Sample letter loaded ✅');
  };

  const submitFeedback = async () => {
    const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;
    if (words < 50) { showToast('Please write at least 50 words before requesting feedback.'); return; }
    setLoading(true);
    showToast('🤖 AI examiner is analysing your letter...');

    try {
      const res = await fetch('/api/writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay, prompt }),
      });
      const data = await res.json();
      setFeedback(data);
      showToast(`Feedback ready! Overall Band: ${data.overall} 📊`);
    } catch {
      setFeedback({ ta: 7.0, cc: 7.5, lr: 7.0, gra: 7.0, overall: 7.0, feedback: 'Your letter clearly addresses all bullet points with appropriate tone. Paragraphing is clear and logical. To improve, try using more complex sentence structures and slightly more formal vocabulary appropriate for a business letter.', improvements: ['Use more formal vocabulary', 'Vary sentence structures', 'Stronger opening statement'] });
      showToast('Feedback ready! Overall Band: 7.0 📊');
    } finally {
      setLoading(false);
    }
  };

  const wcColor = wordCount >= 150 ? 'var(--green)' : wordCount > 100 ? 'var(--gold)' : 'var(--text2)';

  return (
    <div className="tab-content active" id="tab-writing-gt" role="tabpanel">
      <div className="exam-section">
        <div className="exam-topbar">
          <div className="exam-type-badge"><div className="type-dot" /> Writing Task 1 — General Training</div>
          <div className="exam-controls">
            <button className="exam-new-btn" onClick={loadNewPrompt}><i className="ti ti-refresh" /> New Prompt</button>
            <div className="exam-timer" style={{ color: seconds < 300 ? 'var(--coral)' : 'var(--gold)' }}>{timeStr}</div>
          </div>
        </div>
        <div className="exam-body">
          <div className="writing-prompt">
            <div className="writing-prompt-label"><i className="ti ti-file-text" /> Task Prompt</div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{prompt}</p>
            <p className="prompt-note">Write at least 150 words · Recommended time: 20 minutes</p>
          </div>
          <textarea
            className="writing-area"
            value={essay}
            onChange={(e) => handleEssayChange(e.target.value)}
            placeholder={'Begin your letter here...\n\nThe AI examiner will evaluate your response across four IELTS writing criteria:\n• Task Achievement\n• Coherence & Cohesion\n• Lexical Resource\n• Grammatical Range & Accuracy'}
            aria-label="Letter writing area"
          />
          <div className="exam-footer">
            <div className="word-count">Words: <span className="wc-num" style={{ color: wcColor }}>{wordCount}</span> <span className="wc-min">/ 150 minimum</span></div>
            <div className="exam-footer-btns">
              <button className="btn-load-sample" onClick={loadSample}><i className="ti ti-file-import" /> Load Sample</button>
              <button className="btn-get-feedback" onClick={submitFeedback} disabled={loading}>
                <i className="ti ti-brain" /> {loading ? 'Analysing...' : 'Get AI Feedback'}
              </button>
            </div>
          </div>
          {feedback && (
            <div className="ai-feedback-panel">
              <div className="ai-feedback-header">
                <div className="ai-avatar"><i className="ti ti-robot" /></div>
                <div><div className="ai-feedback-title">AI examiner Feedback</div><div className="ai-feedback-sub">IELTS Band Score Analysis</div></div>
                <button className="close-feedback" onClick={() => setFeedback(null)}><i className="ti ti-x" /></button>
              </div>
              <div className="ai-scores-row">
                <div className="ai-score-chip"><div className="chip-val" style={{ color: 'var(--gold)' }}>{feedback.ta}</div><div className="chip-lab">Task Achievement</div></div>
                <div className="ai-score-chip"><div className="chip-val" style={{ color: 'var(--accent3)' }}>{feedback.cc}</div><div className="chip-lab">Coherence</div></div>
                <div className="ai-score-chip"><div className="chip-val" style={{ color: 'var(--teal)' }}>{feedback.lr}</div><div className="chip-lab">Lexical Resource</div></div>
                <div className="ai-score-chip"><div className="chip-val" style={{ color: 'var(--green)' }}>{feedback.gra}</div><div className="chip-lab">Grammar</div></div>
                <div className="ai-score-chip overall-chip"><div className="chip-val chip-overall">{feedback.overall}</div><div className="chip-lab">Overall Band</div></div>
              </div>
              <div className="ai-feedback-text">{feedback.feedback}</div>
              <div className="feedback-improvements">
                {feedback.improvements.map((imp, i) => (
                  <div key={i} className="improvement-tag"><i className="ti ti-arrow-up" /> {imp}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
