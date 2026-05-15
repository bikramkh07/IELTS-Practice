import { NextResponse } from 'next/server';
import { gemini, hasGeminiKey } from '@/lib/gemini';

const MOCK_RESPONSE = {
  ta: 6.5, cc: 7.0, lr: 6.5, gra: 7.0, overall: 6.5,
  feedback: 'Your argument is logically structured and your position is clearly maintained throughout the essay. To improve toward Band 7, focus on varying sentence structures more — try using mixed conditionals and relative clauses effectively. Replace high-frequency words like "good" and "important" with more precise academic vocabulary such as "beneficial" and "significant".',
  improvements: ['Use more discourse markers', 'Vary sentence length', 'Stronger conclusion'],
};

export async function POST(req: Request) {
  try {
    const { essay, prompt } = await req.json();

    if (!hasGeminiKey) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an expert IELTS Examiner. Score this essay on Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.

Each score should be a float like 6.0 or 6.5.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{"ta": number, "cc": number, "lr": number, "gra": number, "overall": number, "feedback": "string", "improvements": ["string", "string", "string"]}

IELTS Writing Prompt: ${prompt}

Student Essay: ${essay}`
        }]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const text = result.response.text();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('Writing API error:', error);
    return NextResponse.json(MOCK_RESPONSE);
  }
}
