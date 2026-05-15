import {
  parseSpeakingFeedback,
  parseWritingFeedback,
  type SpeakingFeedback,
  type WritingFeedback,
} from '@/lib/api-response';

async function parseError(res: Response): Promise<never> {
  let message = 'Request failed';
  try {
    const data = await res.json();
    if (typeof data.error === 'string') message = data.error;
  } catch {
    /* ignore */
  }
  throw new Error(message);
}

export async function fetchWritingFeedback(
  essay: string,
  prompt: string,
): Promise<WritingFeedback> {
  const res = await fetch('/api/writing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ essay, prompt }),
  });

  const data = await res.json();
  if (!res.ok) await parseError(res);
  return parseWritingFeedback(data, Boolean(data.mock));
}

export async function fetchSpeakingFeedback(audio: Blob, filename: string): Promise<SpeakingFeedback> {
  const form = new FormData();
  form.append('audio', audio, filename);

  const res = await fetch('/api/speaking', { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) await parseError(res);
  return parseSpeakingFeedback(data, Boolean(data.mock));
}
