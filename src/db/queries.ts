import { db } from './index';
import { words, decodablePassages, sessions, progress, reviewWords, fluencyScores } from './schema';
import { desc, eq, lte } from 'drizzle-orm';

// Basic CRUD Operations to expose Database to the application layer

export async function getAllWords() {
  return db.select().from(words).all();
}

export async function getDecodablePassages() {
  return db.select().from(decodablePassages).all();
}

export async function getSessionHistory() {
  return db.select().from(sessions).orderBy(desc(sessions.completedAt)).all();
}

export async function getProgress() {
  return db.select().from(progress).all();
}

export async function getReviewWords() {
  return db.select().from(reviewWords).all();
}

export async function getDueReviewWords() {
  const todayStr = new Date().toISOString();
  return db.select().from(reviewWords).where(lte(reviewWords.nextReviewDate, todayStr)).all();
}

export async function saveSessionResults(payload: any) {
  const sessionDate = new Date(payload.completedAt || Date.now()).toISOString();

  // 1. Insert session record
  await db.insert(sessions).values({
    id: payload.sessionId,
    date: sessionDate,
    lessonId: payload.lessonId,
    startedAt: new Date(payload.startedAt),
    completedAt: new Date(payload.completedAt || Date.now()),
    parentId: 'default',
    parentNotes: payload.parentNotes || '',
  }).onConflictDoNothing();

  // 2. Queue trouble words & advance correctly reviewed words
  const troubleWordsSet = new Set(payload.troubleWords || []);
  const reviewedWordsSet = new Set(payload.reviewedWords || []);

  // Process all words that were explicitly reviewed (e.g., in Flashcards)
  for (const word of Array.from(reviewedWordsSet) as string[]) {
    const isMistake = troubleWordsSet.has(word);
    troubleWordsSet.delete(word); // Remove so we don't process it twice

    const existing = await db.select().from(reviewWords).where(eq(reviewWords.word, word)).all();
    
    if (existing && existing.length > 0) {
      if (isMistake) {
        // Reset interval to 1 day
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await db.update(reviewWords)
          .set({ timesMissed: existing[0].timesMissed + 1, nextReviewDate: tomorrow })
          .where(eq(reviewWords.id, existing[0].id));
      } else {
        // Answered correctly! Increase interval by 3 days
        const nextDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        await db.update(reviewWords)
          .set({ nextReviewDate: nextDate })
          .where(eq(reviewWords.id, existing[0].id));
      }
    } else if (isMistake) {
        // Somehow it was reviewed but not in the DB, and missed.
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await db.insert(reviewWords).values({
          id: `rw_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          word: word,
          dateAdded: sessionDate,
          nextReviewDate: tomorrow,
          timesMissed: 1,
        });
    }
  }

  // Any remaining trouble words were NOT from the formal review (e.g. Passage Reader)
  // Queue them up for tomorrow.
  for (const word of Array.from(troubleWordsSet) as string[]) {
    const existing = await db.select().from(reviewWords).where(eq(reviewWords.word, word)).all();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    if (existing && existing.length > 0) {
      await db.update(reviewWords)
        .set({ timesMissed: existing[0].timesMissed + 1, nextReviewDate: tomorrow })
        .where(eq(reviewWords.id, existing[0].id));
    } else {
      await db.insert(reviewWords).values({
        id: `rw_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        word: word,
        dateAdded: sessionDate,
        nextReviewDate: tomorrow,
        timesMissed: 1,
      });
    }
  }

  // 3. Save fluency score if present
  if (payload.fluencyStats && payload.fluencyStats.wpm !== undefined && payload.fluencyStats.wpm >= 0) {
    await db.insert(fluencyScores).values({
      id: `fs_${Date.now()}`,
      date: sessionDate,
      passageId: payload.lessonId,
      readingNumber: 1,
      totalWords: 100, // Not explicitly tracked by PassageReader payload right now, using default
      errors: payload.fluencyStats.mistakes ? payload.fluencyStats.mistakes.length : 0,
      wcpm: payload.fluencyStats.wpm,
      accuracyPct: payload.fluencyStats.accuracy,
      timeSeconds: 60,
    });
  }
}

