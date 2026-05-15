'use client';
import { useState, useEffect, useRef } from 'react';
import { useToast } from './Toast';

const READING_ANSWERS: Record<number, string> = { 1: 'TRUE', 2: 'FALSE', 3: 'NG', 4: 'FALSE', 5: 'TRUE' };
const READING_BAND: Record<number, string> = { 0: '4.0', 1: '4.5', 2: '5.0', 3: '5.5', 4: '6.0', 5: '6.5' };

const QUESTIONS = [
  { num: 1, text: 'Employees must provide at least two weeks\' notice before taking annual leave.' },
  { num: 2, text: 'Unused annual leave can be transferred to another employee.' },
  { num: 3, text: 'Managers are required to respond to leave requests within 48 hours.' },
  { num: 4, text: 'Sick leave can be converted into annual leave if not used by December 31st.' },
  { num: 5, text: 'Employees are entitled to public holidays in addition to their standard annual leave.' },
];

export default function ReadingGTModule() {
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showScore, setShowScore] = useState(false);
  const [seconds, setSeconds] = useState(1200); // 20 mins for section 1
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
    <div className="tab-content active" id="tab-reading-gt" role="tabpanel">
      <div className="reading-wrap">
        <div className="reading-header">
          <div>
            <h3 className="reading-title">General Training Reading — Section 1</h3>
            <div className="reading-meta">Company Leave Policy · Questions 1–5</div>
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
              <p><strong>Employee Leave and Absence Policy</strong></p>
              <p><strong>Annual Leave</strong><br/>All full-time employees are entitled to 20 days of paid annual leave per calendar year. Leave accrues pro-rata for part-time staff. Employees must submit leave requests through the HR portal at least 14 days in advance of the intended start date. During peak operational periods (November to December), requests may be denied depending on staffing requirements.</p>
              <p><strong>Carrying Over Leave</strong><br/>Employees are encouraged to take their full annual leave entitlement within the calendar year to ensure proper rest and well-being. However, up to 5 days of unused annual leave may be carried over to the following year. These carried-over days must be used by March 31st. Under no circumstances can annual leave be transferred to another colleague or cashed out.</p>
              <p><strong>Sick Leave</strong><br/>Employees are entitled to 10 days of paid sick leave annually. If you are unable to attend work due to illness, you must notify your direct line manager by phone no later than 8:30 AM on the first day of absence. A medical certificate is required for absences exceeding three consecutive days. Unused sick leave does not carry over to the next year and cannot be converted into annual leave.</p>
              <p><strong>Public Holidays</strong><br/>The company observes all national public holidays. These days are paid and do not count against your annual leave entitlement. If you are required to work on a public holiday due to emergency operations, you will be compensated at double your standard hourly rate or given a day off in lieu.</p>
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
                <button className="btn-next-passage" onClick={() => showToast('Loading next section...')}>Next Section →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
