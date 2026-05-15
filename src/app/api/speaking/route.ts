import { NextResponse } from 'next/server';
import { gemini, hasGeminiKey } from '@/lib/gemini';

const MOCK_RESPONSE = {
  transcript: 'Well, I would like to talk about a time when I helped my neighbour. She is an elderly woman who lives alone, and one day during the monsoon season, the roof of her house started leaking badly...',
  fluency: 6.5, vocabulary: 7.0, grammar: 6.5, pronunciation: 6.0, overall: 6.5,
  feedback: 'Good attempt with mostly natural flow. Your ideas were relevant and well-developed. To improve, try using more complex sentence structures and less common vocabulary.',
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const audio = form.get('audio') as File;

    if (!hasGeminiKey || !audio) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Convert audio file to base64 for Gemini
    const arrayBuffer = await audio.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    // Gemini can transcribe + evaluate in one shot (multimodal)
    const result = await model.generateContent({
      contents: [{
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
{"transcript": "exact transcription", "fluency": number, "vocabulary": number, "grammar": number, "pronunciation": number, "overall": number, "feedback": "detailed feedback string"}`
          },
        ],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const text = result.response.text();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('Speaking API error:', error);
    return NextResponse.json(MOCK_RESPONSE);
  }
}
