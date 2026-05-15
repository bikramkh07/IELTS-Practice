/**
 * BandUp AI — IELTS Band 7+ Academy
 * app.js — Main Application Logic
 */

'use strict';

/* ──────────────────────────────────────────────
   STATE
────────────────────────────────────────────── */
const state = {
  Examseconds: 2400,          // 40 min writing timer
  readingSeconds: 1122,       // 18:42 reading timer
  timerInterval: null,
  readingTimerInterval: null,
  audioInterval: null,
  isRecording: false,
  isPlaying: false,
  audioProgress: 34,          // 34% = 2:14 of 6:30
  audioSeconds: 134,
  toastTimeout: null,
  answeredQuestions: new Set(),
  correctAnswers: 0,
  mobileMenuOpen: false,
};

/* writing prompts pool */
const WRITING_PROMPTS = [
  "Some people believe that governments should invest more in public transport, while others argue that private vehicle ownership should be encouraged. Discuss both views and give your own opinion.",
  "In many countries, the proportion of older people is steadily increasing. What do you think are the positive and negative effects of this trend?",
  "Some people think that children should begin their formal education at a very early age. Others believe they should not go to school until they are older. Discuss both views and give your own opinion.",
  "Many cities around the world are growing very rapidly. What problems does rapid urbanisation bring, and what solutions can you suggest?",
  "It is generally believed that some people are born with certain talents, while others are not. However, it is sometimes claimed that any child can be taught to become a good sports person or musician. Discuss both views and give your own opinion.",
  "In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in. What are the reasons for this? How might people research this?",
];

/* correct answers for reading */
const READING_ANSWERS = { 1: 'FALSE', 2: 'TRUE', 3: 'FALSE', 4: 'NG', 5: 'TRUE' };

/* band score map for reading (out of 5) */
const READING_BAND = { 0: '4.0', 1: '4.5', 2: '5.5', 3: '6.0', 4: '6.5', 5: '7.0–7.5' };

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildSparklines();
  buildStreak();
  buildAudioWaveform();
  startWritingTimer();
  startReadingTimer();
  initNavScroll();
  initIntersectionAnimations();
});

/* ──────────────────────────────────────────────
   NAVBAR
────────────────────────────────────────────── */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 72;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

function toggleMobileMenu() {
  state.mobileMenuOpen = !state.mobileMenuOpen;
  const links = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');
  const btn = document.getElementById('hamburger');
  if (!links || !overlay || !btn) return;

  links.classList.toggle('open', state.mobileMenuOpen);
  overlay.classList.toggle('visible', state.mobileMenuOpen);
  btn.innerHTML = state.mobileMenuOpen
    ? '<i class="ti ti-x"></i>'
    : '<i class="ti ti-menu-2"></i>';
}

function closeMobileMenu() {
  state.mobileMenuOpen = false;
  const links = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');
  const btn = document.getElementById('hamburger');
  if (links) links.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
  if (btn) btn.innerHTML = '<i class="ti ti-menu-2"></i>';
}

/* ──────────────────────────────────────────────
   TOAST
────────────────────────────────────────────── */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(state.toastTimeout);
  toast.textContent = msg;
  toast.classList.add('visible');

  state.toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, duration);
}

/* ──────────────────────────────────────────────
   SPARKLINES
────────────────────────────────────────────── */
function buildSparklines() {
  buildSparkline('sparkline1',
    [5.0, 5.5, 5.5, 6.0, 6.0, 6.0, 6.5, 6.5],
    'linear-gradient(to top, var(--accent), var(--accent3))');

  buildSparkline('sparkline2',
    [2, 4, 3, 5, 4, 6, 5, 7],
    'linear-gradient(to top, var(--teal), #5ffff5)');

  buildSparkline('sparkline3',
    [80, 120, 90, 150, 130, 180, 160, 220],
    'linear-gradient(to top, var(--gold), var(--gold2))');
}

function buildSparkline(id, data, gradient) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  const max = Math.max(...data);
  data.forEach(v => {
    const bar = document.createElement('div');
    bar.className = 'spark-bar';
    bar.style.height = Math.max(4, (v / max) * 40) + 'px';
    bar.style.background = gradient;
    el.appendChild(bar);
  });
}

/* ──────────────────────────────────────────────
   STREAK TRACKER
────────────────────────────────────────────── */
function buildStreak() {
  const el = document.getElementById('streakRow');
  if (!el) return;
  el.innerHTML = '';
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const states = ['done', 'done', 'done', 'done', 'done', 'done', 'done',
    'done', 'done', 'done', 'done', 'done', 'done', 'done',
    'active', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'];
  states.slice(0, 14).forEach((s, i) => {
    const d = document.createElement('div');
    d.className = `streak-day ${s}`;
    d.textContent = labels[i % 7];
    d.title = s === 'done' ? 'Completed' : s === 'active' ? 'Today' : 'Not started';
    el.appendChild(d);
  });
}

/* ──────────────────────────────────────────────
   DASHBOARD TABS
────────────────────────────────────────────── */
const DASH_DATA = {
  overall: { band: '6.5', sub: '+0.5 this month ↑', offset: 68 },
  weekly: { band: '6.0', sub: '+0.5 this week ↑', offset: 102 },
  monthly: { band: '5.5', sub: '30-day baseline', offset: 136 },
};

function setDashTab(el, type) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  const d = DASH_DATA[type];
  if (!d) return;

  const num = document.getElementById('bandNumber');
  const sub = document.getElementById('bandSub');
  const ring = document.getElementById('ringFill');

  if (num) num.textContent = d.band;
  if (sub) sub.textContent = d.sub;
  if (ring) ring.style.strokeDashoffset = d.offset;
}

/* ──────────────────────────────────────────────
   MODULE TABS
────────────────────────────────────────────── */
function switchModule(mod, el) {
  document.querySelectorAll('.module-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

  el.classList.add('active');

  const tab = document.getElementById('tab-' + mod);
  if (tab) tab.classList.add('active');

  if (mod === 'writing' && !state.timerInterval) startWritingTimer();
}

function switchModuleById(mod) {
  scrollToSection('modules');
  const el = document.querySelector(`.module-tab[onclick*="'${mod}'"]`);
  if (el) switchModule(mod, el);
}

/* ──────────────────────────────────────────────
   WRITING TIMER
────────────────────────────────────────────── */
function startWritingTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (state.Examseconds > 0) {
      state.Examseconds--;
      const m = Math.floor(state.Examseconds / 60);
      const s = state.Examseconds % 60;
      const el = document.getElementById('ExamsTimer');
      if (el) el.textContent = `${m}:${String(s).padStart(2, '0')}`;

      // turn red when < 5 min
      if (el) el.style.color = state.Examseconds < 300 ? 'var(--coral)' : 'var(--gold)';
    } else {
      clearInterval(state.timerInterval);
      showToast('⏰ Time is up! Submitting your essay...');
    }
  }, 1000);
}

/* ──────────────────────────────────────────────
   READING TIMER
────────────────────────────────────────────── */
function startReadingTimer() {
  clearInterval(state.readingTimerInterval);
  state.readingTimerInterval = setInterval(() => {
    if (state.readingSeconds > 0) {
      state.readingSeconds--;
      const m = Math.floor(state.readingSeconds / 60);
      const s = state.readingSeconds % 60;
      const el = document.getElementById('readingTimer');
      if (el) el.textContent = `${m}:${String(s).padStart(2, '0')}`;
      if (el) el.style.color = state.readingSeconds < 180 ? 'var(--coral)' : 'var(--gold)';
    }
  }, 1000);
}

/* ──────────────────────────────────────────────
   WRITING MODULE
────────────────────────────────────────────── */
function updateWordCount() {
  const text = (document.getElementById('writingArea') || {}).value || '';
  const count = text.trim() ? text.trim().split(/\s+/).length : 0;
  const el = document.getElementById('wordCountDisplay');
  if (!el) return;
  el.textContent = count;
  if (count >= 250) {
    el.style.color = 'var(--green)';
  } else if (count > 150) {
    el.style.color = 'var(--gold)';
  } else {
    el.style.color = 'var(--text2)';
  }
}

function loadNewPrompt() {
  const el = document.getElementById('promptText');
  if (!el) return;
  const current = el.textContent.trim();
  const others = WRITING_PROMPTS.filter(p => p !== current);
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = others[Math.floor(Math.random() * others.length)];
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '1';
  }, 200);
  // reset timer
  state.Examseconds = 2400;
  showToast('New prompt loaded! Timer reset. ✍️');
}

function loadSampleEssay() {
  const essay = `Public transportation and private vehicle ownership represent two contrasting approaches to urban mobility, each with distinct advantages and limitations. In my view, a balanced approach is essential for sustainable development.

Those who advocate for greater investment in public transport argue that it is significantly more environmentally sustainable. Buses, trains and metro systems can transport hundreds of passengers simultaneously, thereby reducing carbon emissions per capita considerably. Furthermore, efficient metro systems, such as those in Tokyo and Singapore, dramatically reduce urban congestion and contribute to economic productivity by decreasing commute times.

On the other hand, proponents of private vehicle ownership emphasise the importance of individual freedom and flexibility. Personal vehicles allow people to travel at their own convenience, particularly in rural or suburban areas where public transport infrastructure is limited or entirely nonexistent. For many families, a car is not a luxury but a necessity for accessing employment, healthcare and education.

In my opinion, governments should prioritise investment in robust public transport systems while simultaneously implementing policies that discourage excessive private vehicle usage in urban centres. This dual strategy acknowledges both the environmental imperatives of our time and the practical realities faced by citizens in less connected regions.

In conclusion, neither approach should be adopted exclusively. A pragmatic combination of improved public infrastructure and thoughtful regulation of private vehicles offers the most viable path toward sustainable and equitable urban mobility.`;

  const area = document.getElementById('writingArea');
  if (!area) return;
  area.value = essay;
  updateWordCount();
  showToast('Sample essay loaded — 278 words ✅');
}

function submitForFeedback() {
  const text = (document.getElementById('writingArea') || {}).value || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  if (words < 50) {
    showToast('Please write at least 50 words before requesting feedback.');
    return;
  }

  showToast('🤖 AI Examiner is analysing your essay...');

  setTimeout(() => {
    const panel = document.getElementById('aiFeedbackPanel');
    if (panel) {
      panel.style.display = 'block';
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    showToast('Feedback ready! Overall Band: 6.5 📊');
  }, 1800);
}

/* ──────────────────────────────────────────────
   SPEAKING MODULE
────────────────────────────────────────────── */
function toggleMic() {
  state.isRecording = !state.isRecording;

  const btn = document.getElementById('micBtn');
  const icon = document.getElementById('micIcon');
  const status = document.getElementById('micStatus');
  const wave = document.getElementById('waveWrap');
  const ring = document.getElementById('micRing');

  if (state.isRecording) {
    btn.classList.add('active');
    btn.style.background = 'linear-gradient(135deg, #c53030, #9b2c2c)';
    if (icon) icon.className = 'ti ti-player-stop';
    if (status) { status.textContent = 'Recording… Click to stop'; status.style.color = 'var(--coral)'; }
    if (wave) wave.classList.remove('paused');
    if (ring) ring.style.background = 'rgba(255,107,107,0.12)';
    showToast('🎤 Recording started — speak naturally');
  } else {
    btn.classList.remove('active');
    btn.style.background = 'linear-gradient(135deg, var(--coral), #e53e3e)';
    if (icon) icon.className = 'ti ti-microphone';
    if (status) { status.textContent = 'Click the mic to start recording'; status.style.color = 'var(--text3)'; }
    if (wave) wave.classList.add('paused');
    if (ring) ring.style.background = 'rgba(255,107,107,0.06)';
    showToast('⏳ Processing speech… AI evaluating fluency & coherence');
  }
}

/* ──────────────────────────────────────────────
   AUDIO PLAYER
────────────────────────────────────────────── */
function buildAudioWaveform() {
  const wrap = document.getElementById('audioWaveform');
  if (!wrap) return;
  wrap.innerHTML = '';
  const total = 60;
  const playedUntil = Math.floor((state.audioProgress / 100) * total);
  for (let i = 0; i < total; i++) {
    const bar = document.createElement('div');
    bar.className = 'audio-wf-bar' + (i < playedUntil ? ' played' : '');
    const h = 4 + Math.random() * 22;
    bar.style.height = h + 'px';
    wrap.appendChild(bar);
  }
}

function togglePlay() {
  state.isPlaying = !state.isPlaying;
  const icon = document.getElementById('playIcon');

  if (state.isPlaying) {
    if (icon) icon.className = 'ti ti-player-pause';
    showToast('🎧 Playing audio — listen carefully!');
    runAudioProgress();
  } else {
    if (icon) icon.className = 'ti ti-player-play';
    clearInterval(state.audioInterval);
  }
}

function runAudioProgress() {
  clearInterval(state.audioInterval);
  const totalSecs = 390; // 6:30

  state.audioInterval = setInterval(() => {
    if (!state.isPlaying) { clearInterval(state.audioInterval); return; }

    state.audioSeconds = Math.min(state.audioSeconds + 0.1, totalSecs);
    state.audioProgress = (state.audioSeconds / totalSecs) * 100;

    const bar = document.getElementById('audioProgress');
    const timeCur = document.getElementById('currentTime');
    if (bar) bar.style.width = state.audioProgress + '%';
    if (timeCur) {
      const m = Math.floor(state.audioSeconds / 60);
      const s = Math.floor(state.audioSeconds % 60);
      timeCur.textContent = `${m}:${String(s).padStart(2, '0')}`;
    }

    // update waveform played bars
    const bars = document.querySelectorAll('.audio-wf-bar');
    const playedUntil = Math.floor((state.audioProgress / 100) * bars.length);
    bars.forEach((b, i) => b.classList.toggle('played', i < playedUntil));

    if (state.audioProgress >= 100) {
      clearInterval(state.audioInterval);
      state.isPlaying = false;
      const icon = document.getElementById('playIcon');
      if (icon) icon.className = 'ti ti-player-play';
      showToast('Audio finished! Now answer the questions.');
    }
  }, 100);
}

function submitListeningAnswers() {
  const inputs = document.querySelectorAll('.lq-input');
  let filled = 0;
  inputs.forEach(inp => { if (inp.value.trim()) filled++; });

  if (filled === 0) {
    showToast('Please fill in at least one answer before submitting.');
    return;
  }
  showToast(`✅ ${filled} answer${filled > 1 ? 's' : ''} submitted! AI is checking...`);
  setTimeout(() => showToast(`📊 Results: ${filled}/6 answered. Estimated band: 6.5`), 2200);
}

/* ──────────────────────────────────────────────
   READING MODULE
────────────────────────────────────────────── */
function answerRQ(btn, qNum, selected, correct) {
  if (state.answeredQuestions.has(qNum)) return; // prevent re-answering
  state.answeredQuestions.add(qNum);

  // disable all buttons in this question
  const parent = btn.closest('.rq-body');
  if (parent) {
    parent.querySelectorAll('.rq-btn').forEach(b => {
      b.style.opacity = '0.5';
      b.style.pointerEvents = 'none';
    });
  }

  const isCorrect = selected === correct;
  btn.style.opacity = '1';
  btn.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');

  const feedback = document.getElementById('rqf' + qNum);
  if (feedback) {
    feedback.textContent = isCorrect
      ? '✓ Correct!'
      : `✗ Incorrect. Answer: ${correct}`;
    feedback.className = 'rq-feedback ' + (isCorrect ? 'correct' : 'wrong');
  }

  if (isCorrect) state.correctAnswers++;

  // show check button once >= 2 questions answered
  const checkBtn = document.getElementById('checkReadingBtn');
  if (checkBtn && state.answeredQuestions.size >= 2) checkBtn.style.display = 'flex';

  showToast(isCorrect ? '✓ Correct!' : `✗ Incorrect — Answer: ${correct}`);
}

function checkReadingAnswers() {
  const total = 5;
  const correct = state.correctAnswers;
  const band = READING_BAND[correct] || '4.0';

  const panel = document.getElementById('readingScorePanel');
  const numEl = document.getElementById('rspNum');
  const bandEl = document.getElementById('rspBand');
  const checkBtn = document.getElementById('checkReadingBtn');

  if (numEl) numEl.textContent = correct;
  if (bandEl) bandEl.textContent = band;
  if (panel) panel.style.display = 'block';
  if (checkBtn) checkBtn.style.display = 'none';

  showToast(`📊 ${correct}/${total} correct — Estimated band: ${band}`);
}

/* ──────────────────────────────────────────────
   FAQ ACCORDION
────────────────────────────────────────────── */
function toggleFaq(el) {
  const isOpen = el.classList.contains('open');
  // close all
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  // toggle clicked
  if (!isOpen) el.classList.add('open');
}

/* ──────────────────────────────────────────────
   INTERSECTION OBSERVER (fade-in on scroll)
────────────────────────────────────────────── */
function initIntersectionAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.feat-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animation = `fadeSlideUp 0.5s ${i * 0.08}s ease both`;
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  document.querySelectorAll('.testi-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animation = `fadeSlideUp 0.5s ${i * 0.06}s ease both`;
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  document.querySelectorAll('.step-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animation = `fadeSlideUp 0.5s ${i * 0.12}s ease both`;
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

/* ──────────────────────────────────────────────
   PWA SERVICE WORKER
────────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.log('[SW] Registration failed:', err));
  });
}
