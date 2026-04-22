import { NextResponse } from 'next/server';
import { saveSessionResults } from '@/db/queries';
import { evaluatePatternMastery } from '@/lib/engine/mastery-evaluator';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const payload = await request.json();
    
    // Validate basic payload
    if (!payload || !payload.sessionId) {
      return NextResponse.json({ error: 'Invalid payload: Missing sessionId' }, { status: 400 });
    }

    // Attempt to save to database
    await saveSessionResults(payload, userId);
    
    // Evaluate mastery asynchronously without blocking the response
    evaluatePatternMastery(payload.lessonId, userId).catch(err => {
      console.error('Error evaluating mastery:', err);
    });

    return NextResponse.json({ success: true, message: 'Session saved successfully' });
  } catch (error: any) {
    console.error('Error saving session progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
