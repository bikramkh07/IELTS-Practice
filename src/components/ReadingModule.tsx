'use client';
import { useState, useEffect, useRef } from 'react';
import { useToast } from './Toast';

const READING_ANSWERS: Record<number, string> = { 1: 'FALSE', 2: 'TRUE', 3: 'FALSE', 4: 'NG', 5: 'TRUE' };
const READING_BAND: Record<number, string> = { 0: '4.0', 1: '4.5', 2: '5.5', 3: '6.0', 4: '6.5', 5: '7.0–7.5' };

const QUESTIONS = [
  { num: 1, text: 'Human memory functions like a recording device that stores exact copies of experiences.' },
  { num: 2, text: 'Elizabeth Loftus conducted research on how the language of questions affects memory recall.' },
  { num: 3, text: 'Eyewitness testimony is considered completely reliable in modern court cases.' },
  { num: 4, text: 'A schema is a type of long-term memory storage system in the brain.' },
  { num: 5, text: 'People can be convinced to remember events that never actually occurred.' },
];

export default function ReadingModule() {
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showScore, setShowScore] = useState(false);
  const [seconds, setSeconds] = useState(1122);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    timerRef.current = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [hasStarted]);

  const timeStr = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const correctCount = Object.entries(answers).filter(([k, v]) => READING_ANSWERS[Number(k)] === v).length;

  const answerQ = (num: number, selected: string) => {
    if (!hasStarted) setHasStarted(true);
    if (answers[num]) return;
    setAnswers((prev) => ({ ...prev, [num]: selected }));
    const correct = READING_ANSWERS[num];
    showToast(selected === correct ? '✓ Correct!' : `✗ Incorrect — Answer: ${correct}`);
  };

  const checkAnswers = () => {
    setShowScore(true);
    showToast(`📊 ${correctCount}/${5} correct — Estimated band: ${READING_BAND[correctCount] || '4.0'}`);
  };

  return (
    <div className="tab-content active" id="tab-reading" role="tabpanel">
      <div className="reading-wrap">
        <div className="reading-header">
          <div>
            <h3 className="reading-title">Academic Reading — Passage 1</h3>
            <div className="reading-meta">The Psychology of Memory · Questions 1–13</div>
          </div>
          <div className="reading-controls">
            <div className="reading-timer" style={{ color: seconds < 180 ? 'var(--coral)' : 'var(--gold)' }}>{timeStr}</div>
            <button className="btn-reading-ctrl" onClick={() => showToast('Passage options menu...')}><i className="ti ti-dots" /></button>
          </div>
        </div>
        <div className="reading-layout">
          <div className="passage-col">
            <div className="passage-label">Reading Passage</div>
            <div className="passage-text">
              <p><strong>The Reconstructive Nature of Memory</strong></p>
              <p>Memory is not a perfect recording device. Unlike a video camera that passively captures events, human memory is an active process of reconstruction. Every time we recall an event, we do not simply play back a stored file; instead, we rebuild the memory from fragments, influenced by our subsequent experiences, knowledge, and even the questions we are asked.</p>
              <p>This reconstructive quality was demonstrated powerfully by psychologist Elizabeth Loftus in her landmark studies on eyewitness testimony. In one famous experiment, participants who watched a film of a car accident were asked about the speed of the vehicles. Those asked &quot;How fast were the cars going when they smashed?&quot; gave significantly higher estimates than those asked &quot;How fast were the cars going when they contacted?&quot;</p>
              <p>The implications of this research are profound. If memory is so easily influenced by the phrasing of a question, then eyewitness testimony — long considered the gold standard of courtroom evidence — must be viewed with considerable scepticism. In fact, memory researchers have consistently found that people can be made to remember events that never happened at all, simply by being exposed to misleading post-event information.</p>
              <p>Schema theory provides one explanation for this malleability. A schema is a mental framework — a set of expectations and assumptions about how the world works. When we encounter new information, we do not store it in isolation; rather, we interpret it through the lens of our existing schemas. This can lead to systematic distortions: details that don&apos;t fit our expectations may be unconsciously altered or forgotten entirely.</p>
            </div>
          </div>
          <div className="questions-col">
            <div className="questions-label">Questions 1–5: True / False / Not Given</div>
            <div className="reading-questions">
              {QUESTIONS.map((q) => {
                const answered = !!answers[q.num];
                const isCorrect = answers[q.num] === READING_ANSWERS[q.num];
                return (
                  <div className="rq-item" key={q.num}>
                    <div className="rq-num">{q.num}</div>
                    <div className="rq-body">
                      <div className="rq-text">{q.text}</div>
                      <div className="rq-options">
                        {['TRUE', 'FALSE', 'NG'].map((opt) => {
                          const btnClass = opt === 'TRUE' ? 'true-btn' : opt === 'FALSE' ? 'false-btn' : 'ng-btn';
                          const isSelected = answers[q.num] === opt;
                          const selectedClass = isSelected ? (isCorrect ? ' selected-correct' : ' selected-wrong') : '';
                          return (
                            <button
                              key={opt}
                              className={`rq-btn ${btnClass}${selectedClass}`}
                              onClick={() => answerQ(q.num, opt)}
                              style={{ opacity: answered && !isSelected ? 0.5 : 1, pointerEvents: answered ? 'none' : 'auto' }}
                            >
                              {opt === 'NG' ? 'NOT GIVEN' : opt}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div className={`rq-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                          {isCorrect ? '✓ Correct!' : `✗ Incorrect. Answer: ${READING_ANSWERS[q.num]}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {Object.keys(answers).length >= 2 && !showScore && (
              <button className="btn-check-reading" onClick={checkAnswers}><i className="ti ti-check" /> Check My Answers</button>
            )}
            {showScore && (
              <div className="reading-score-panel">
                <div className="rsp-score"><span>{correctCount}</span>/5 correct</div>
                <div className="rsp-band">Estimated band for this section: <strong>{READING_BAND[correctCount] || '4.0'}</strong></div>
                <button className="btn-next-passage" onClick={() => showToast('Loading next passage...')}>Next Passage →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
