import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { phonicsPatterns, sessions, fluencyScores, progress } from '@/db/schema';
import { desc, asc } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. Get Today's Lesson (for MVP, fetch the lowest sequenceOrder pattern or one that is IN_PROGRESS)
    // Here we'll just fetch the first pattern as standard.
    const allPatterns = await db.select().from(phonicsPatterns).orderBy(asc(phonicsPatterns.sequenceOrder));
    const currentPattern = allPatterns[0];

    // 2. Get Session History
    const sessionHistoryReq = await db.select().from(sessions).orderBy(desc(sessions.completedAt)).limit(5);

    // 3. Get Fluency Progress (WCPM)
    const fluencyDataReq = await db.select().from(fluencyScores).orderBy(asc(fluencyScores.date)).limit(10);
    
    // 4. Get Skills Map (Progress)
    const progressReq = await db.select().from(progress);
    
    // Construct progress map object: { [patternId]: status }
    const skillsMap: Record<string, string> = {};
    allPatterns.forEach(p => {
      skillsMap[p.id] = 'NOT_STARTED'; // default
    });
    progressReq.forEach(p => {
      skillsMap[p.patternId] = p.status;
    });

    const responsePayload = {
      today: new Date().toISOString(),
      streak: 8, // hardcoded for MVP unless we calculate from sessions
      currentLesson: {
        id: currentPattern?.id || 'unknown',
        name: currentPattern?.name || 'Lesson 1',
        type: 'New Concept',
        estTime: 12
      },
      fluencyProgress: fluencyDataReq.length > 0 ? fluencyDataReq : [
        { date: '2026-04-10', wcpm: 20 },
        { date: '2026-04-11', wcpm: 22 },
        { date: '2026-04-12', wcpm: 28 },
        { date: '2026-04-14', wcpm: 30 }
      ], // Fallback data
      sessionHistory: sessionHistoryReq.map(s => ({
        date: s.completedAt?.toISOString() || s.date,
        lessonId: s.lessonId,
        durationMin: s.startedAt && s.completedAt ? Math.round((s.completedAt.getTime() - s.startedAt.getTime()) / 60000) : 12,
        wcpm: 0 // Mock, actual wcpm is in fluencyScores
      })),
      skillsMap
    };

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return NextResponse.json({ error: 'Failed to complete dashboard request' }, { status: 500 });
  }
}
