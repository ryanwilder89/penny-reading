import { NextResponse } from 'next/server';
import { generateSessionPlan } from '@/lib/engine/session-planner';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patternIdParam = searchParams.get('patternId');

    const plan = await generateSessionPlan(patternIdParam || undefined);

    return NextResponse.json(plan);
  } catch (err) {
    console.error('Error fetching session plan:', err);
    return NextResponse.json({ error: 'Failed to generate session plan' }, { status: 500 });
  }
}
