import { db } from '@/db/index';
import { fluencyScores, progress } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * Evaluates whether the child has mastered the given phonics pattern.
 * Criteria: Last 2 fluency scores on this pattern have > 90% accuracy and > 40 WCPM.
 */
export async function evaluatePatternMastery(patternId: string) {
  // Query recent fluency scores for passages related to this pattern
  const recentScores = await db.select()
    .from(fluencyScores)
    .where(eq(fluencyScores.passageId, patternId))
    .orderBy(desc(fluencyScores.date))
    .limit(2);

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
    const existingProgress = await db.select().from(progress).where(eq(progress.patternId, patternId)).all();
    
    if (existingProgress && existingProgress.length > 0) {
      await db.update(progress)
        .set({ status: 'MASTERED', dateMastered: new Date().toISOString() })
        .where(eq(progress.patternId, patternId));
    } else {
      await db.insert(progress).values({
        patternId,
        status: 'MASTERED',
        dateIntroduced: new Date().toISOString(),
        dateMastered: new Date().toISOString(),
        masteryCriteriaMet: true
      });
    }

    return true;
  }

  // Not mastered yet, but log an in-progress record if one doesn't exist
  const existingProgress = await db.select().from(progress).where(eq(progress.patternId, patternId)).all();
  if (!existingProgress || existingProgress.length === 0) {
    await db.insert(progress).values({
      patternId,
      status: 'IN_PROGRESS',
      dateIntroduced: new Date().toISOString(),
    });
  }

  return false;
}
