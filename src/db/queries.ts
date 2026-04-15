import { db } from './index';
import { words, decodablePassages, sessions, progress, reviewWords } from './schema';
import { desc } from 'drizzle-orm';

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
