import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { phonicsPatterns, progress, readingSessions, fluencyScores } from '@/db/schema';
import { desc, asc, eq } from 'drizzle-orm';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const allPatterns = await db.select().from(phonicsPatterns).orderBy(asc(phonicsPatterns.sequenceOrder));
    
    // 1. Get Skills Map (Progress)
    const progressReq = await db.select().from(progress).where(eq(progress.userId, userId));
    const skillsMap: Record<string, string> = {};
    allPatterns.forEach(p => {
      skillsMap[p.id] = 'NOT_STARTED'; // default
    });
    progressReq.forEach(p => {
      skillsMap[p.patternId] = p.status;
    });

    // 2. Get Today's Lesson (find first that is not MASTERED)
    const currentPattern = allPatterns.find(p => skillsMap[p.id] !== 'MASTERED') || allPatterns[0];

    // 3. Get Session History
    const sessionHistoryReq = await db.select().from(readingSessions)
      .where(eq(readingSessions.userId, userId))
      .orderBy(desc(readingSessions.completedAt))
      .limit(5);

    // 4. Get Fluency Progress (WCPM)
    const fluencyDataReq = await db.select().from(fluencyScores)
      .where(eq(fluencyScores.userId, userId))
      .orderBy(asc(fluencyScores.date))
      .limit(10);

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
