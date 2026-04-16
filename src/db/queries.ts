import { db } from './index';
import { words, decodablePassages, sessions, progress, reviewWords, fluencyScores } from './schema';
import { desc, eq } from 'drizzle-orm';

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
  }).onConflictDoNothing();

  // 2. Queue trouble words
  if (payload.troubleWords && payload.troubleWords.length > 0) {
    // deduplicate words just in case
    const uniqueWords = Array.from(new Set(payload.troubleWords)) as string[];
    
    for (const word of uniqueWords) {
      const existing = await db.select().from(reviewWords).where(eq(reviewWords.word, word)).all();
      if (existing && existing.length > 0) {
        await db.update(reviewWords)
          .set({ timesMissed: existing[0].timesMissed + 1 })
          .where(eq(reviewWords.id, existing[0].id));
      } else {
        await db.insert(reviewWords).values({
          id: `rw_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          word: word,
          dateAdded: sessionDate,
          nextReviewDate: sessionDate,
          timesMissed: 1,
        });
      }
    }
  }

  // 3. Save fluency score if present
  if (payload.fluencyStats && payload.fluencyStats.wpm > 0) {
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

