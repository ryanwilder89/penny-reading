import { db } from './index';
import { phonicsPatterns, words, decodablePassages, sessions, wordChains, fluencyScores, progress, reviewWords } from './schema';
import { seedPhonicsPatterns, seedWords, seedDecodablePassages } from '../data/seed-data';

async function main() {
  console.log('Seeding database...');
  
  // 1. Clear existing data to make the script idempotent
  db.delete(phonicsPatterns).run();
  db.delete(words).run();
  db.delete(decodablePassages).run();
  db.delete(sessions).run();
  db.delete(wordChains).run();
  db.delete(fluencyScores).run();
  db.delete(progress).run();
  db.delete(reviewWords).run();

  // 2. Insert new data
  if (seedPhonicsPatterns.length > 0) {
    db.insert(phonicsPatterns).values(seedPhonicsPatterns).run();
  }
  if (seedWords.length > 0) {
    db.insert(words).values(seedWords).run();
  }
  if (seedDecodablePassages.length > 0) {
    db.insert(decodablePassages).values(seedDecodablePassages).run();
  }
  
  console.log('Database seeded successfully!');
}

main().catch((e) => {
  console.error('Seeding failed');
  console.error(e);
  process.exit(1);
});
