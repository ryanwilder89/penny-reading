import { scopeAndSequence } from '../content/scope-sequence';

export function getTodayLesson(progressData?: any) {
  // If no progress, start at the first lesson (or 2.1 based on placement)
  // For the MVP, we just return the first one or simple mock logic
  // Real implementation would look at progress to find the first NOT_STARTED or IN_PROGRESS.
  if (!progressData || progressData.length === 0) {
    return scopeAndSequence[0];
  }
  
  // Basic mock determination:
  // Find highest pattern
  return scopeAndSequence[0];
}

export function generateSessionPlan(lesson: any, errorWordsToReview: string[] = []) {
  return {
    lesson,
    activities: [
      { type: 'WARMUP', id: 'warmup-1' },
      { type: 'REVIEW', id: 'review-1', data: { extraReviewWords: errorWordsToReview } },
      { type: 'PRACTICE', id: 'practice-1' },
      { type: 'READ', id: 'read-1' }
    ]
  };
}
