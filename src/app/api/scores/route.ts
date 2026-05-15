import { NextResponse } from 'next/server';

// Scores API - placeholder for Prisma integration
// When Clerk + Prisma are configured, this will save/fetch real user scores

export async function GET() {
  return NextResponse.json({
    scores: [],
    message: 'Configure Clerk auth and Prisma database to enable score persistence.',
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: Save to Prisma when configured
    return NextResponse.json({ success: true, score: body });
  } catch {
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
