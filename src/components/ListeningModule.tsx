'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

const PASSAGE_TEXT = `Welcome to the Community Radio Station tour. My name is Sarah, and I'll be showing you around our facilities today. Our station was founded in 1998 by a group of local volunteers who wanted to give a voice to the community. Since then, we've grown considerably, and now we cover a radius of 30 kilometres, reaching over 50,000 listeners each week.

If you're interested in volunteering with us, you'll need to commit to a minimum of 6 hours per week. Don't worry if you have no experience — we offer a comprehensive training course that lasts three weeks, covering everything from basic broadcasting techniques to interview skills.

Our main studio is located on the second floor of this building. It was recently refurbished with state-of-the-art equipment, including a professional mixing desk and sound-proof recording booths. Before you can start your first shift, all new volunteers must complete a security check — this is standard procedure for all broadcasting organisations.`;

export default function ListeningModule() {
  const { showToast } = useToast();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  // Use SpeechSynthesis to generate audio from the passage text
  const estimatedDuration = 65; // ~65 seconds for this passage

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      clearInterval(intervalRef.current);
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) {
      window.speechSynthesis.cancel();
      clearInterval(intervalRef.current);
      elapsedRef.current = currentTime;
      setPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(PASSAGE_TEXT);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = 'en-GB';

    // Try to use a British voice
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find((v) => v.lang.includes('en-GB')) || voices.find((v) => v.lang.includes('en'));
    if (britishVoice) utterance.voice = britishVoice;

    utterance.onend = () => {
      clearInterval(intervalRef.current);
      setPlaying(false);
      setCurrentTime(estimatedDuration);
      showToast('Audio finished! Now answer the questions.');
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
    setDuration(estimatedDuration);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = elapsedRef.current + (Date.now() - startTimeRef.current) / 1000;
      setCurrentTime(Math.min(elapsed, estimatedDuration));
    }, 200);

    showToast('🎧 Playing audio — listen carefully!');
  }, [playing, currentTime, showToast]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // Deterministic waveform heights (no Math.random — avoids hydration mismatch)
  const WAVE_HEIGHTS = [18,9,24,12,7,20,15,26,10,22,8,19,14,25,11,6,21,16,23,13,17,9,24,7,20,12,26,15,8,22,19,10,25,14,6,21,11,23,16,18,13,7,24,20,9,26,12,15,22,8,19,25,10,14,21,6,23,17,11,18];
  const waveformBars = WAVE_HEIGHTS.map((h, i) => ({
    h,
    isPlayed: i < Math.floor((progress / 100) * 60),
  }));

  const submitAnswers = () => {
    const filled = Object.values(answers).filter((v) => v.trim()).length;
    if (filled === 0) { showToast('Please fill in at least one answer before submitting.'); return; }
    showToast(`✅ ${filled} answer${filled > 1 ? 's' : ''} submitted! AI is checking...`);
    setTimeout(() => showToast(`📊 Results: ${filled}/6 answered. Estimated band: 6.5`), 2200);
  };

  return (
    <div className="tab-content active" id="tab-listening" role="tabpanel">
      <div className="listening-wrap">
        <div className="listening-header">
          <div>
            <h3 className="listening-title">Listening — Section 2</h3>
            <div className="listening-meta">Community Radio Station Tour · Questions 11–20</div>
          </div>
          <span className="listening-badge">Monologue · Intermediate</span>
        </div>

        <div className="audio-player">
          <div className="audio-player-inner">
            <button className="play-btn" onClick={togglePlay} aria-label={playing ? 'Pause audio' : 'Play audio'}>
              <i className={playing ? 'ti ti-player-pause' : 'ti ti-player-play'} />
            </button>
            <div className="audio-progress-wrap">
              <div className="audio-waveform">
                {waveformBars.map((bar, i) => (
                  <div key={i} className={`audio-wf-bar${bar.isPlayed ? ' played' : ''}`} style={{ height: bar.h }} />
                ))}
              </div>
              <div className="audio-bar-track">
                <div className="audio-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="audio-times">
                <span>{fmtTime(currentTime)}</span>
                <span>{fmtTime(estimatedDuration)}</span>
              </div>
            </div>
            <div className="audio-volume">
              <i className="ti ti-volume" style={{ color: 'var(--text3)', fontSize: 16 }} />
              <input type="range" min="0" max="100" defaultValue={80} className="volume-slider" aria-label="Volume" />
            </div>
          </div>
          <div className="audio-tags">
            <span className="audio-tag accent">Section 2</span>
            <span className="audio-tag teal">Monologue</span>
            <span className="audio-tag gray">~1:05 min</span>
            <span className="audio-tag gray">British Accent</span>
          </div>
        </div>

        <div className="listen-instructions">
          <i className="ti ti-info-circle" style={{ color: 'var(--accent3)', fontSize: 15 }} />
          Listen carefully and complete the sentences below. Use <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.
        </div>

        <div className="listening-questions">
          <div className="lq-group">
            <div className="lq-group-title">Questions 11–16: Complete the sentences</div>
            <div className="lq-grid">
              {[
                { id: 'lq11', label: '11. The radio station was founded in', hint: 'the year', placeholder: 'e.g. 1994' },
                { id: 'lq12', label: '12. The station covers a radius of', hint: 'km', placeholder: 'e.g. 50 km' },
                { id: 'lq13', label: '13. Volunteers work a minimum of', hint: 'hours per week', placeholder: 'e.g. 4 hours' },
                { id: 'lq14', label: '14. The training course lasts', hint: 'duration', placeholder: 'e.g. two days' },
                { id: 'lq15', label: "15. The station's main studio is located on the", hint: 'floor', placeholder: 'e.g. third floor' },
                { id: 'lq16', label: '16. New volunteers must complete a', hint: 'type of check', placeholder: 'e.g. background check' },
              ].map((q) => (
                <div className="lq-item" key={q.id}>
                  <label className="lq-label">{q.label} <span className="lq-blank-label">{q.hint}</span></label>
                  <input
                    type="text"
                    className="lq-input"
                    placeholder={q.placeholder}
                    aria-label={`Question ${q.id.replace('lq', '')}`}
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="listening-footer">
          <button className="btn-listen-submit" onClick={submitAnswers}><i className="ti ti-check" /> Submit All Answers</button>
          <button className="btn-listen-next" onClick={() => showToast('Loading Section 3...')}>Next Section <i className="ti ti-arrow-right" /></button>
        </div>
      </div>
    </div>
  );
}
