import { NextResponse } from 'next/server';
import { generateSessionPlan } from '@/lib/engine/session-planner';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const patternIdParam = searchParams.get('patternId');

    const plan = await generateSessionPlan(session.user.id, patternIdParam || undefined);

    return NextResponse.json(plan);
  } catch (err) {
    console.error('Error fetching session plan:', err);
    return NextResponse.json({ error: 'Failed to generate session plan' }, { status: 500 });
  }
}
