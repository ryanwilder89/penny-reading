import { db } from './src/db/index';
import { phonicsPatterns, progress, readingSessions, fluencyScores } from './src/db/schema';
import { desc, asc, eq } from 'drizzle-orm';

async function test() {
  const userId = 'non_existent_user';
  
  const allPatterns = await db.select().from(phonicsPatterns).orderBy(asc(phonicsPatterns.sequenceOrder));
  console.log("allPatterns length:", allPatterns.length);

  const progressReq = await db.select().from(progress).where(eq(progress.userId, userId));
  const skillsMap: Record<string, string> = {};
  allPatterns.forEach(p => {
    skillsMap[p.id] = 'NOT_STARTED'; // default
  });
  progressReq.forEach(p => {
    skillsMap[p.patternId] = p.status;
  });

  const currentPattern = allPatterns.find(p => skillsMap[p.id] !== 'MASTERED') || allPatterns[0];
  console.log("currentPattern:", currentPattern);

  const sessionHistoryReq = await db.select().from(readingSessions)
    .where(eq(readingSessions.userId, userId))
    .orderBy(desc(readingSessions.completedAt))
    .limit(5);

  const fluencyDataReq = await db.select().from(fluencyScores)
    .where(eq(fluencyScores.userId, userId))
    .orderBy(asc(fluencyScores.date))
    .limit(10);

  const responsePayload = {
    today: new Date().toISOString(),
    streak: 8, 
    currentLesson: {
      id: currentPattern?.id || 'unknown',
      name: currentPattern?.name || 'Lesson 1',
      type: 'New Concept',
      estTime: 12
    },
    fluencyProgress: fluencyDataReq.length > 0 ? fluencyDataReq : [
      { date: '2026-04-10', wcpm: 20 },
      { date: '2026-04-11', wcpm: 22 }
    ],
    sessionHistory: sessionHistoryReq.map(s => ({
      date: s.completedAt?.toISOString() || s.date,
      lessonId: s.lessonId,
      durationMin: s.startedAt && s.completedAt ? Math.round((s.completedAt.getTime() - s.startedAt.getTime()) / 60000) : 12,
      wcpm: 0
    })),
    skillsMap
  };
  console.log("Success:", responsePayload);
}

test().catch(console.error);
