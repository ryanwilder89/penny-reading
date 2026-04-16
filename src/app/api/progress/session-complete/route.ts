import { NextResponse } from 'next/server';
import { saveSessionResults } from '@/db/queries';
import { evaluatePatternMastery } from '@/lib/engine/mastery-evaluator';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Validate basic payload
    if (!payload || !payload.sessionId) {
      return NextResponse.json({ error: 'Invalid payload: Missing sessionId' }, { status: 400 });
    }

    // Attempt to save to database
    await saveSessionResults(payload);
    
    // Evaluate mastery asynchronously without blocking the response
    evaluatePatternMastery(payload.lessonId).catch(err => {
      console.error('Error evaluating mastery:', err);
    });

    return NextResponse.json({ success: true, message: 'Session saved successfully' });
  } catch (error: any) {
    console.error('Error saving session progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
