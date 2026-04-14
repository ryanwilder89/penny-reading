import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const phonicsPatterns = sqliteTable('phonics_patterns', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phase: integer('phase').notNull(),
  sequenceOrder: real('sequence_order').notNull(),
  description: text('description'),
  parentScript: text('parent_script'),
});

export const words = sqliteTable('words', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  isNonsense: integer('is_nonsense', { mode: 'boolean' }).default(false),
  frequencyList: text('frequency_list'),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  lessonId: text('lesson_id'),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  parentId: text('parent_id'),
  parentNotes: text('parent_notes'),
});

export const wordChains = sqliteTable('word_chains', {
  id: text('id').primaryKey(),
  patternId: text('pattern_id').notNull(),
  words: text('words', { mode: 'json' }).$type<string[]>().notNull(),
  changePositions: text('change_positions', { mode: 'json' }).$type<number[]>().notNull(),
});

export const decodablePassages = sqliteTable('decodable_passages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  wordCount: integer('word_count').notNull(),
  maxPatternId: text('max_pattern_id'),
  patternsUsed: text('patterns_used', { mode: 'json' }).$type<string[]>(),
});

export const fluencyScores = sqliteTable('fluency_scores', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  passageId: text('passage_id').notNull(),
  readingNumber: integer('reading_number').notNull(),
  totalWords: integer('total_words').notNull(),
  errors: integer('errors').notNull(),
  wcpm: real('wcpm').notNull(),
  accuracyPct: real('accuracy_pct').notNull(),
  timeSeconds: integer('time_seconds').notNull(),
});

export const progress = sqliteTable('progress', {
  patternId: text('pattern_id').primaryKey(),
  status: text('status').notNull(), // NOT_STARTED, IN_PROGRESS, MASTERED
  accuracyHistory: text('accuracy_history', { mode: 'json' }).$type<number[]>(),
  dateIntroduced: text('date_introduced'),
  dateMastered: text('date_mastered'),
  masteryCriteriaMet: integer('mastery_criteria_met', { mode: 'boolean' }).default(false),
});

export const reviewWords = sqliteTable('review_words', {
  id: text('id').primaryKey(),
  word: text('word').notNull(),
  dateAdded: text('date_added').notNull(), // ISO Date string
  nextReviewDate: text('next_review_date').notNull(), // ISO Date string
  timesMissed: integer('times_missed').default(1).notNull(),
});
