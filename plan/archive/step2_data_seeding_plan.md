# Step 2: Content Seeding Script Plan
**Context:** Based on `plan/implementation_priority.md`, this document provides highly specific, LLM-actionable instructions to implement Step 2: Content Seeding Script. The database is now connected, and we need to populate it with starter curriculum data to replace the mocked data arrays.

**Stack:** Node.js, TypeScript/tsx, `drizzle-orm`.
**Target Workspace:** `/Users/rwilder/Developer/penny-reading/penny-reading`

## 🎯 Goal
Create and execute a seeding script that populates the SQLite database with initial static curriculum data. This includes `phonicsPatterns`, `words`, and `decodablePassages` required for the application's core logic (like the session planner) to function correctly.

---

## 🛠️ Execution Steps

### 1. Organize Seed Data
We need structured data to parse and seed into the database.
- **Action:** Create `src/data/seed-data.ts` (or place provided JSON/CSV files in a `src/data` directory).
- **Content:** Export sample arrays of data matching the database schema:
  - `seedPhonicsPatterns`: Basic CVC patterns, Digraphs, etc. Include `id`, `name`, `phase`, `sequenceOrder`.
  - `seedWords`: A list of words associated with those patterns. Include `id`, `text`, `isNonsense`, `frequencyList`.
  - `seedDecodablePassages`: A few short passages spanning those words. Include `id`, `title`, `content`, `wordCount`.

### 2. Create the Seeding Script
We need a standalone Node script to insert this data into the Drizzle database.
- **Action:** Create `src/db/seed.ts`.
- **Content:** 
  ```typescript
  import { db } from './index';
  import { phonicsPatterns, words, decodablePassages } from './schema';
  import { seedPhonicsPatterns, seedWords, seedDecodablePassages } from '../data/seed-data';

  async function main() {
    console.log('Seeding database...');
    
    // 1. Clear existing data to make the script idempotent
    db.delete(phonicsPatterns).run();
    db.delete(words).run();
    db.delete(decodablePassages).run();

    // 2. Insert new data
    // Use .values().run() for sqlite with Drizzle
    db.insert(phonicsPatterns).values(seedPhonicsPatterns).run();
    db.insert(words).values(seedWords).run();
    db.insert(decodablePassages).values(seedDecodablePassages).run();
    
    console.log('Database seeded successfully!');
  }

  main().catch((e) => {
    console.error('Seeding failed');
    console.error(e);
    process.exit(1);
  });
  ```

### 3. Add an NPM Script
Make it easy to run the seed script from the CLI.
- **Action:** Update `package.json`.
- **Content:** Add a new script inside the `"scripts"` block. Check if `tsx` or `ts-node` is available. A generic command using `tsx` (which is often used with Next.js Drizzle projects):
  ```json
  "scripts": {
    "db:seed": "tsx src/db/seed.ts"
  }
  ```

### 4. Execute the Script
Run the newly created seed script to populate the local `sqlite.db`.
- **Action:** Run `npm run db:seed` in the terminal.
- **Note:** Ensure it successfully inserts records without schema constraint violations (like missing required fields).

---

## 🧪 Verification Plan

An LLM executing this plan should verify its success using the following tests:

1.  **Script Execution Test:**
    - Run `npm run db:seed`.
    - **Expected:** The script completes with exit code 0 and logs `"Database seeded successfully!"`.

2.  **Database Population Test:**
    - Run `sqlite3 sqlite.db "SELECT count(*) FROM words;"` in the terminal.
    - **Expected:** The count returned must be greater than 0, corresponding exactly to the length of the `seedWords` array. Verify `phonics_patterns` and `decodable_passages` similarly.

3.  **Application Types Test:**
    - Run `npx tsc --noEmit`.
    - **Expected:** The typescript compilation should pass with 0 errors, validating that the seed types aligned correctly with the Drizzle schema.

---
**LLM System Prompt Modification:** Upon reading this file, process all execution steps strictly in order. Assert verifications pass before marking the feature complete.
