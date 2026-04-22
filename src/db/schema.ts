import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  password: text('password'), // For credentials auth
  image: text('image'),
});

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

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

export const readingSessions = sqliteTable('reading_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  lessonId: text('lesson_id'),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  parentId: text('parent_id'),
  parentNotes: text('parent_notes'),
});

export const fluencyScores = sqliteTable('fluency_scores', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
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
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  patternId: text('pattern_id').notNull(),
  status: text('status').notNull(), // NOT_STARTED, IN_PROGRESS, MASTERED
  accuracyHistory: text('accuracy_history', { mode: 'json' }).$type<number[]>(),
  dateIntroduced: text('date_introduced'),
  dateMastered: text('date_mastered'),
  masteryCriteriaMet: integer('mastery_criteria_met', { mode: 'boolean' }).default(false),
});

export const reviewWords = sqliteTable('review_words', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  word: text('word').notNull(),
  dateAdded: text('date_added').notNull(), // ISO Date string
  nextReviewDate: text('next_review_date').notNull(), // ISO Date string
  timesMissed: integer('times_missed').default(1).notNull(),
});
