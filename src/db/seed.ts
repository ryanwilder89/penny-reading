import { db } from './index';
import { phonicsPatterns, words, decodablePassages, readingSessions, wordChains, fluencyScores, progress, reviewWords, users, accounts } from './schema';
import { scopeAndSequence, PASSAGES, WORD_CHAINS } from '../lib/content';

async function main() {
  console.log('Seeding database...');
  
  // 1. Clear existing data to make the script idempotent
  db.delete(accounts).run();
  db.delete(users).run();
  db.delete(phonicsPatterns).run();
  db.delete(words).run();
  db.delete(decodablePassages).run();
  db.delete(readingSessions).run();
  db.delete(wordChains).run();
  db.delete(fluencyScores).run();
  db.delete(progress).run();
  db.delete(reviewWords).run();

  // 2. Data Mapping & ID Normalization
  const orderToId = new Map<string, string>();
  const seedPhonicsPatterns = scopeAndSequence.map(pattern => {
    orderToId.set(pattern.order.toString(), pattern.id);
    return {
      id: pattern.id,
      name: pattern.name,
      phase: pattern.phase,
      sequenceOrder: pattern.order,
      description: null,
      parentScript: pattern.script,
    };
  });

  const allWords = new Set<string>();
  scopeAndSequence.forEach(p => {
    p.words.forEach(w => allWords.add(w.toLowerCase()));
  });

  const seedWords = Array.from(allWords).map(w => ({
    id: `word_${w}`,
    text: w,
    isNonsense: false,
    frequencyList: null,
  }));

  const seedDecodablePassages = Object.values(PASSAGES).map(passage => {
    const maxPatternId = orderToId.get(passage.maxPatternId) || passage.maxPatternId;
    const patternsUsed = passage.patternsUsed.map(p => orderToId.get(p) || p);
    
    return {
      id: passage.id,
      title: passage.title,
      content: passage.text || passage.content || "",
      wordCount: passage.wordCount,
      maxPatternId,
      patternsUsed,
    };
  });

  const seedWordChains = Object.values(WORD_CHAINS).map(chain => {
    const patternId = orderToId.get(chain.patternId) || chain.patternId;
    return {
      id: chain.id,
      patternId,
      words: chain.words,
      changePositions: chain.changePositions,
    };
  });

  // 3. Insert new data
  if (seedPhonicsPatterns.length > 0) {
    db.insert(phonicsPatterns).values(seedPhonicsPatterns).run();
  }
  if (seedWords.length > 0) {
    db.insert(words).values(seedWords).run();
  }
  if (seedDecodablePassages.length > 0) {
    db.insert(decodablePassages).values(seedDecodablePassages).run();
  }
  if (seedWordChains.length > 0) {
    db.insert(wordChains).values(seedWordChains).run();
  }
  
  console.log('Database seeded successfully!');
}

main().catch((e) => {
  console.error('Seeding failed');
  console.error(e);
  process.exit(1);
});
