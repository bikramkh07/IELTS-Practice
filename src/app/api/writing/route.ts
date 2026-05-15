import { NextResponse } from 'next/server';
import { gemini, hasGeminiKey } from '@/lib/gemini';
import { requireAuth } from '@/lib/api-auth';
import { parseWritingFeedback, type WritingFeedback } from '@/lib/api-response';

const MAX_ESSAY_CHARS = 12_000;
const MAX_PROMPT_CHARS = 2_000;

const MOCK_RESPONSE: WritingFeedback = {
  ta: 6.5,
  cc: 7.0,
  lr: 6.5,
  gra: 7.0,
  overall: 6.5,
  feedback:
    'Your argument is logically structured and your position is clearly maintained throughout the essay. To improve toward Band 7, focus on varying sentence structures more.',
  improvements: ['Use more discourse markers', 'Vary sentence length', 'Stronger conclusion'],
  mock: true,
};

export async function POST(req: Request) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const { essay, prompt } = await req.json();

    if (typeof essay !== 'string' || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (essay.length > MAX_ESSAY_CHARS || prompt.length > MAX_PROMPT_CHARS) {
      return NextResponse.json({ error: 'Essay or prompt too long' }, { status: 413 });
    }

    const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
    if (wordCount < 50) {
      return NextResponse.json(
        { error: 'Essay must be at least 50 words' },
        { status: 400 },
      );
    }

    if (!hasGeminiKey) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert IELTS Examiner. Score this essay on Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.

Each score should be a float like 6.0 or 6.5.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{"ta": number, "cc": number, "lr": number, "gra": number, "overall": number, "feedback": "string", "improvements": ["string", "string", "string"]}

IELTS Writing Prompt: ${prompt}

Student Essay: ${essay}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const text = result.response.text();
    return NextResponse.json(parseWritingFeedback(JSON.parse(text)));
  } catch (error) {
    console.error('Writing API error:', error);
    return NextResponse.json(MOCK_RESPONSE);
  }
}
