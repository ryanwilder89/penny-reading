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
});
