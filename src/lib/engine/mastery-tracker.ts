export type MasteryStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'MASTERED';

export interface AccuracyEntry {
  date: string; // ISO date string
  accuracyPct: number;
}

/**
 * A pattern is marked MASTERED when the child achieves 90%+ accuracy across 3 consecutive sessions.
 * If accuracy drops below 80% on a previously mastered skill, it is re-queued as IN_PROGRESS.
 */
export function evaluateMastery(
  currentStatus: MasteryStatus, 
  history: AccuracyEntry[]
): MasteryStatus {
  if (!history || history.length === 0) return 'NOT_STARTED';
  
  // Sort by date asc
  const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  if (currentStatus === 'MASTERED') {
    // If accuracy drops below 80% on a previously mastered skill
    const lastSession = sorted[sorted.length - 1];
    if (lastSession.accuracyPct < 80) {
      return 'IN_PROGRESS';
    }
    return 'MASTERED';
  }
  
  // To move to mastered, need 90%+ across 3 consecutive sessions
  if (sorted.length >= 3) {
    const last3 = sorted.slice(-3);
    const allAbove90 = last3.every(s => s.accuracyPct >= 90);
    if (allAbove90) {
      return 'MASTERED';
    }
  }
  
  return 'IN_PROGRESS';
}
