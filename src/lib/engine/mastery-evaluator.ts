import { db } from '@/db/index';
import { fluencyScores, progress } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * Evaluates whether the child has mastered the given phonics pattern.
 * Criteria: Last 2 fluency scores on this pattern have > 90% accuracy and > 40 WCPM.
 */
export async function evaluatePatternMastery(patternId: string, userId: string) {
  // Query recent fluency scores for passages related to this pattern
  const recentScores = await db.select()
    .from(fluencyScores)
    .where(and(eq(fluencyScores.passageId, patternId), eq(fluencyScores.userId, userId)))
    .orderBy(desc(fluencyScores.date))
    .limit(2);

  // Not mastered yet, but log an in-progress record if one doesn't exist
  const existingProgress = await db.select().from(progress).where(and(eq(progress.patternId, patternId), eq(progress.userId, userId))).all();
  if (!existingProgress || existingProgress.length === 0) {
    const newId = `prog_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    await db.insert(progress).values({
      id: newId,
      userId,
      patternId,
      status: 'IN_PROGRESS',
      accuracyHistory: [],
      dateIntroduced: new Date().toISOString(),
    });
  }

  if (recentScores.length < 2) {
    // Need at least 2 sessions to prove mastery
    return false;
  }

  const [lastScore, previousScore] = recentScores;

  const isMastered = 
    lastScore.accuracyPct >= 90 && lastScore.wcpm >= 40 &&
    previousScore.accuracyPct >= 90 && previousScore.wcpm >= 40;

  if (isMastered) {
    // Update progress table
    const existingProgressCheck = await db.select().from(progress).where(and(eq(progress.patternId, patternId), eq(progress.userId, userId))).all();
    
    if (existingProgressCheck && existingProgressCheck.length > 0) {
      await db.update(progress)
        .set({ status: 'MASTERED', dateMastered: new Date().toISOString() })
        .where(eq(progress.id, existingProgressCheck[0].id));
    } else {
      const newId = `prog_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await db.insert(progress).values({
        id: newId,
        userId,
        patternId,
        status: 'MASTERED',
        dateIntroduced: new Date().toISOString(),
        dateMastered: new Date().toISOString(),
        masteryCriteriaMet: true
      });
    }

    return true;
  }

  return false;
}
