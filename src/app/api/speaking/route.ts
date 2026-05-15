import { NextResponse } from 'next/server';
import { gemini, hasGeminiKey } from '@/lib/gemini';
import { requireAuth } from '@/lib/api-auth';
import { parseSpeakingFeedback, type SpeakingFeedback } from '@/lib/api-response';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB

const MOCK_RESPONSE: SpeakingFeedback = {
  transcript:
    'Well, I would like to talk about a time when I helped my neighbour...',
  fluency: 6.5,
  vocabulary: 7.0,
  grammar: 6.5,
  pronunciation: 6.0,
  overall: 6.5,
  feedback:
    'Good attempt with mostly natural flow. Your ideas were relevant and well-developed.',
  mock: true,
};

export async function POST(req: Request) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

  try {
    const form = await req.formData();
    const audio = form.get('audio');

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 });
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: 'Audio file too large' }, { status: 413 });
    }

    if (!hasGeminiKey) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const arrayBuffer = await audio.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: audio.type || 'audio/webm',
                data: base64Audio,
              },
            },
            {
              text: `You are an expert IELTS speaking Examiner.

1. First, transcribe the audio exactly as spoken.
2. Then evaluate the speaking on: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation.

Each score should be a float like 6.0 or 6.5.

Return ONLY valid JSON with this structure (no markdown, no code fences):
{"transcript": "exact transcription", "fluency": number, "vocabulary": number, "grammar": number, "pronunciation": number, "overall": number, "feedback": "detailed feedback string"}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const text = result.response.text();
    return NextResponse.json(parseSpeakingFeedback(JSON.parse(text)));
  } catch (error) {
    console.error('Speaking API error:', error);
    return NextResponse.json(MOCK_RESPONSE);
  }
}
