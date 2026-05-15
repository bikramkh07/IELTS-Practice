# BandUp AI — IELTS Band 7+ Academy

AI-powered IELTS preparation platform. Practice speaking, writing, reading and listening with your personal AI Examiner — available 24/7.

---

## 🚀 Quick Start

### Option 1 — Open directly in browser
Double-click `index.html` — the site runs with zero dependencies.

### Option 2 — Local dev server (recommended)
```bash
# Using Python
python -m http.server 3000

# Using Node.js / npx
npx serve .

# Using VS Code
# Install "Live Server" extension → Right-click index.html → Open with Live Server
```
Then open: http://localhost:3000

---

## 📁 File Structure

```
bandup-ai/
├── index.html          # Main HTML — all pages in one file
├── styles.css          # Full production stylesheet (~900 lines)
├── app.js              # Application logic, interactions, timers
├── manifest.json       # PWA manifest (install to home screen)
├── sw.js               # Service Worker (offline support, push notifications)
├── README.md           # This file
└── icons/              # PWA icons (generate at realfavicongenerator.net)
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    └── icon-512.png
```

---

## ✨ Features

### Practice Modules
| Module   | Features |
|----------|----------|
| ✍️ Writing | Live 40-min timer, 6 rotating prompts, word counter, AI band score feedback panel (TA / Coherence / Lexical / Grammar), sample essay loader |
| 🎤 Speaking | Mic toggle with animated wave bars, Part 1–3 tracker, cue card display, speaking score breakdown |
| 📖 Reading  | Passage + True/False/NG questions, instant answer checking, band score estimate |
| 🎧 Listening | Audio player with waveform visualiser, fill-in-the-blank questions, answer submission |

### Dashboard
- Band score ring (animated SVG)
- 4-skill breakdown with colour-coded progress bars
- Sparkline charts (dynamic JS generation)
- 14-day streak tracker
- Today's AI-generated study plan
- AI recommendation panel

### UX / Design
- Dark futuristic aesthetic (bg #05060a)
- Syne 800 display font + DM Sans body
- Animated orbs, dot-grid hero
- Scroll-triggered fade-in animations (IntersectionObserver)
- Sticky navbar with blur + scrolled state
- Mobile-first responsive (hamburger menu, collapsible nav)
- Toast notifications
- FAQ accordion

### PWA
- `manifest.json` — installable on home screen
- `sw.js` — cache-first offline support
- Push notification scaffolding for study reminders

---

## 🔧 Upgrade to Full Production Stack

This is a complete static frontend. To add real AI and authentication:

### 1. Framework
```bash
npx create-next-app@latest bandup-ai --typescript --tailwind --app
```

### 2. AI Integration
```bash
npm install openai
```
```ts
// app/api/writing/route.ts
import OpenAI from 'openai';
const client = new OpenAI();

export async function POST(req: Request) {
  const { essay, prompt } = await req.json();
  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'system',
      content: `You are an expert IELTS Examiner. Score this essay on Task Achievement,
                Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.
                Return JSON: { ta, cc, lr, gra, overall, feedback, improvements[] }`
    }, {
      role: 'user',
      content: `Prompt: ${prompt}\n\nEssay: ${essay}`
    }],
    response_format: { type: 'json_object' }
  });
  return Response.json(JSON.parse(res.choices[0].message.content));
}
```

### 3. Speech Recognition (Speaking)
```bash
npm install openai
```
```ts
// app/api/speaking/route.ts
export async function POST(req: Request) {
  const form = await req.formData();
  const audio = form.get('audio') as File;
  const transcript = await openai.audio.transcriptions.create({
    file: audio,
    model: 'whisper-1',
    language: 'en',
  });
  // then send transcript to GPT for IELTS scoring
}
```

### 4. Authentication
```bash
npm install @clerk/nextjs
```

### 5. Database
```bash
npm install prisma @prisma/client
npx prisma init
```

### 6. Recommended `.env.local`
```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 🌍 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo at vercel.com — auto-deploys on every push.

---

## 🎨 Design Tokens

```css
--bg:      #05060a   /* deep space black */
--accent:  #6c63ff   /* electric purple */
--teal:    #0dd9c8   /* AI cyan */
--gold:    #f59e0b   /* amber alerts */
--coral:   #ff6b6b   /* speaking red */
--green:   #22c55e   /* success green */
```

Fonts: **Syne 800** (headings) · **DM Sans** (body)

---

## 📱 PWA Icons

Generate all required icon sizes at:
https://realfavicongenerator.net

Place the exported icons in the `/icons/` folder.

---

## 📄 License

MIT License — free to use, modify and distribute.

Built with ❤️ for IELTS students across South Asia.
