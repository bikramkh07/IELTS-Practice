import { NextResponse } from 'next/server';
import { requireAuth, ensureDbUser } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { hasClerk } from '@/lib/clerk-config';

export async function GET() {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

  if (!hasClerk || authResult.userId === 'anonymous') {
    return NextResponse.json({ scores: [] });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: authResult.userId },
      include: {
        scores: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });

    return NextResponse.json({ scores: user?.scores ?? [] });
  } catch (error) {
    console.error('Scores GET error:', error);
    return NextResponse.json({ scores: [], error: 'Database unavailable' });
  }
}

export async function POST(req: Request) {
  const authResult = await requireAuth();
  if ('error' in authResult) return authResult.error;

  if (!hasClerk || authResult.userId === 'anonymous') {
    return NextResponse.json(
      { error: 'Sign in and configure a database to save scores' },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();
    const user = await ensureDbUser(authResult.userId);

    const score = await prisma.score.create({
      data: {
        userId: user.id,
        module: String(body.module ?? 'unknown'),
        overall: Number(body.overall) || 0,
        ta: body.ta != null ? Number(body.ta) : null,
        cc: body.cc != null ? Number(body.cc) : null,
        lr: body.lr != null ? Number(body.lr) : null,
        gra: body.gra != null ? Number(body.gra) : null,
        fluency: body.fluency != null ? Number(body.fluency) : null,
        vocabulary: body.vocabulary != null ? Number(body.vocabulary) : null,
        grammar: body.grammar != null ? Number(body.grammar) : null,
        pronunciation: body.pronunciation != null ? Number(body.pronunciation) : null,
      },
    });

    return NextResponse.json({ success: true, score });
  } catch (error) {
    console.error('Scores POST error:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
