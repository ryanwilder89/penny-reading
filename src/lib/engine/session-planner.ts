import { db } from '@/db/index';
import { phonicsPatterns, words, decodablePassages, reviewWords } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function getTodayLesson(progressData?: any) {
  // If no progress, start at the first lesson
  const allPatterns = await db.select().from(phonicsPatterns).orderBy(asc(phonicsPatterns.sequenceOrder));
  return allPatterns[0];
}

export async function generateSessionPlan(patternId?: string) {
  let currentPattern;
  if (patternId) {
    const dbPattern = await db.select().from(phonicsPatterns).where(eq(phonicsPatterns.id, patternId)).limit(1);
    currentPattern = dbPattern[0];
  } else {
    currentPattern = await getTodayLesson();
  }

  if (!currentPattern) {
    throw new Error('No phonics patterns found in database.');
  }

  const allWords = await db.select().from(words).limit(20);
  const reviewWordsReq = await db.select().from(reviewWords).limit(5);

  const patternPassages = await db.select().from(decodablePassages).where(eq(decodablePassages.maxPatternId, currentPattern.id));
  const targetPassage = patternPassages.length > 0 ? patternPassages[0] : (await db.select().from(decodablePassages).limit(1))[0];

  return {
    lesson: currentPattern,
    activities: [
      { 
        type: 'WARMUP', 
        id: 'warmup-1',
        data: {
          prompts: [
            { instruction: `Say 'stop'. Now say it without the /s/.`, answer: "top" },
            { instruction: `Say 'flat'. Change /f/ to /s/.`, answer: "slat" }
          ]
        }
      },
      { 
        type: 'REVIEW', 
        id: 'review-1', 
        data: { 
          words: reviewWordsReq.length > 0 ? reviewWordsReq.map(w => w.word) : ['clap', 'sled', 'drum', 'frog', 'jump']
        } 
      },
      { 
        type: 'PRACTICE', 
        id: 'practice-1',
        data: {
          initialWord: allWords[0]?.text || "flat",
          targetWord: allWords[1]?.text || "flop",
          availableLetters: Array.from(new Set([...(allWords[1]?.text || "flop").split(''), 'o', 'i', 's', 'p', 'm', 'a']))
        }
      },
      { 
        type: 'READ', 
        id: 'read-1',
        data: {
          passage: targetPassage || { id: 'fallback', title: 'Fallback Passage', content: 'No passage found.', wordCount: 3, maxPatternId: '' }
        }
      }
    ]
  };
}
