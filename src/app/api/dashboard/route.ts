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
    const fluencyDataReqDesc = await db.select().from(fluencyScores)
      .where(eq(fluencyScores.userId, userId))
      .orderBy(desc(fluencyScores.date))
      .limit(30);
      
    const fluencyDataReq = [...fluencyDataReqDesc].reverse();

    // Calculate Streak
    const allUserSessions = await db.select({ date: readingSessions.date, completedAt: readingSessions.completedAt })
      .from(readingSessions)
      .where(eq(readingSessions.userId, userId))
      .orderBy(desc(readingSessions.date));

    const uniqueDates = Array.from(new Set(
      allUserSessions
        .filter(s => s.completedAt !== null)
        .map(s => {
          try {
            return new Date(s.date).toISOString().split('T')[0];
          } catch (e) {
            return s.date.split('T')[0];
          }
        })
    ));

    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    let currentStr = checkDate.toISOString().split('T')[0];

    if (uniqueDates.includes(currentStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      currentStr = checkDate.toISOString().split('T')[0];
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
      currentStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates.includes(currentStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        currentStr = checkDate.toISOString().split('T')[0];
      }
    }

    if (streak > 0) {
      while (uniqueDates.includes(currentStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        currentStr = checkDate.toISOString().split('T')[0];
      }
    }

    const responsePayload = {
      today: new Date().toISOString(),
      streak: streak,
      currentLesson: {
        id: currentPattern?.id || 'unknown',
        name: currentPattern?.name || 'Lesson 1',
        type: 'New Concept',
        estTime: 12
      },
      fluencyProgress: fluencyDataReq,
      sessionHistory: sessionHistoryReq.map(s => {
        const match = fluencyDataReqDesc.find(f => f.date === s.date);
        return {
          date: s.completedAt?.toISOString() || s.date,
          lessonId: s.lessonId,
          durationMin: s.startedAt && s.completedAt ? Math.round((s.completedAt.getTime() - s.startedAt.getTime()) / 60000) : 12,
          wcpm: match ? match.wcpm : 0
        };
      }),
      skillsMap
    };

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return NextResponse.json({ error: 'Failed to complete dashboard request' }, { status: 500 });
  }
}
