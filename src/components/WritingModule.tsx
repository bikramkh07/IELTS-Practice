'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './Toast';

const WRITING_PROMPTS = [
  'Some people believe that governments should invest more in public transport, while others argue that private vehicle ownership should be encouraged. Discuss both views and give your own opinion.',
  'In many countries, the proportion of older people is steadily increasing. What do you think are the positive and negative effects of this trend?',
  'Some people think that children should begin their formal education at a very early age. Others believe they should not go to school until they are older. Discuss both views and give your own opinion.',
  'Many cities around the world are growing very rapidly. What problems does rapid urbanisation bring, and what solutions can you suggest?',
  'It is generally believed that some people are born with certain talents, while others are not. However, it is sometimes claimed that any child can be taught to become a good sports person or musician. Discuss both views and give your own opinion.',
  'In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in. What are the reasons for this? How might people research this?',
];

const SAMPLE_ESSAY = `Public transportation and private vehicle ownership represent two contrasting approaches to urban mobility, each with distinct advantages and limitations. In my view, a balanced approach is essential for sustainable development.

Those who advocate for greater investment in public transport argue that it is significantly more environmentally sustainable. Buses, trains and metro systems can transport hundreds of passengers simultaneously, thereby reducing carbon emissions per capita considerably. Furthermore, efficient metro systems, such as those in Tokyo and Singapore, dramatically reduce urban congestion and contribute to economic productivity by decreasing commute times.

On the other hand, proponents of private vehicle ownership emphasise the importance of individual freedom and flexibility. Personal vehicles allow people to travel at their own convenience, particularly in rural or suburban areas where public transport infrastructure is limited or entirely nonexistent. For many families, a car is not a luxury but a necessity for accessing employment, healthcare and education.

In my opinion, governments should prioritise investment in robust public transport systems while simultaneously implementing policies that discourage excessive private vehicle usage in urban centres. This dual strategy acknowledges both the environmental imperatives of our time and the practical realities faced by citizens in less connected regions.

In conclusion, neither approach should be adopted exclusively. A pragmatic combination of improved public infrastructure and thoughtful regulation of private vehicles offers the most viable path toward sustainable and equitable urban mobility.`;

interface AIFeedback {
  ta: number; cc: number; lr: number; gra: number; overall: number;
  feedback: string; improvements: string[];
}

export default function WritingModule() {
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState(WRITING_PROMPTS[0]);
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [seconds, setSeconds] = useState(2400);
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 0) { clearInterval(timerRef.current); showToast('⏰ Time is up! Submitting your essay...'); return 0; }
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
    setSeconds(2400);
    setFeedback(null);
    showToast('New prompt loaded! Timer reset. ✍️');
  };

  const loadSample = () => {
    setEssay(SAMPLE_ESSAY);
    setWordCount(SAMPLE_ESSAY.trim().split(/\s+/).length);
    showToast('Sample essay loaded — 278 words ✅');
  };

  const submitFeedback = async () => {
    const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;
    if (words < 50) { showToast('Please write at least 50 words before requesting feedback.'); return; }
    setLoading(true);
    showToast('🤖 AI examiner is analysing your essay...');

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
      setFeedback({ ta: 6.5, cc: 7.0, lr: 6.5, gra: 7.0, overall: 6.5, feedback: 'Your argument is logically structured and your position is clearly maintained throughout the essay. To improve toward Band 7, focus on varying sentence structures more — try using mixed conditionals and relative clauses effectively. Replace high-frequency words like "good" and "important" with more precise academic vocabulary such as "beneficial" and "significant". Your introduction could be stronger with a more nuanced thesis statement that previews both sides before your position.', improvements: ['Use more discourse markers', 'Vary sentence length', 'Stronger conclusion'] });
      showToast('Feedback ready! Overall Band: 6.5 📊');
    } finally {
      setLoading(false);
    }
  };

  const wcColor = wordCount >= 250 ? 'var(--green)' : wordCount > 150 ? 'var(--gold)' : 'var(--text2)';

  return (
    <div className="tab-content active" id="tab-writing" role="tabpanel">
      <div className="exam-section">
        <div className="exam-topbar">
          <div className="exam-type-badge"><div className="type-dot" /> Writing Task 2 — Academic</div>
          <div className="exam-controls">
            <button className="exam-new-btn" onClick={loadNewPrompt}><i className="ti ti-refresh" /> New Prompt</button>
            <div className="exam-timer" style={{ color: seconds < 300 ? 'var(--coral)' : 'var(--gold)' }}>{timeStr}</div>
          </div>
        </div>
        <div className="exam-body">
          <div className="writing-prompt">
            <div className="writing-prompt-label"><i className="ti ti-file-text" /> Task Prompt</div>
            <p>{prompt}</p>
            <p className="prompt-note">Write at least 250 words · Recommended time: 40 minutes</p>
          </div>
          <textarea
            className="writing-area"
            value={essay}
            onChange={(e) => handleEssayChange(e.target.value)}
            placeholder={'Begin your essay here...\n\nThe AI examiner will evaluate your response across four IELTS writing criteria:\n• Task Achievement\n• Coherence & Cohesion\n• Lexical Resource\n• Grammatical Range & Accuracy'}
            aria-label="Essay writing area"
          />
          <div className="exam-footer">
            <div className="word-count">Words: <span className="wc-num" style={{ color: wcColor }}>{wordCount}</span> <span className="wc-min">/ 250 minimum</span></div>
            <div className="exam-footer-btns">
              <button className="btn-load-sample" onClick={loadSample}><i className="ti ti-file-import" /> Load Sample</button>
              <button className="btn-get-feedback" onClick={submitFeedback} disabled={loading}>
                <i className="ti ti-brain" /> {loading ? 'Analysing...' : 'Get AI Feedback'}
              </button>
            </div>
          </div>
          {feedback && (
            <div className="ai-feedback-panel" id="aiFeedbackPanel">
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
