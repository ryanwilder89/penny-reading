# Step 1: Database Setup and Connection Plan
**Context:** Based on the `plan/implementation_priority.md`, this document provides highly specific, LLM-actionable instructions to implement Step 1: Database Connection & Operations. 

**Stack:** Next.js (App Router), `drizzle-orm`, `better-sqlite3`.
**Target Workspace:** `/Users/rwilder/Developer/penny-reading/penny-reading`

## 🎯 Goal
Instantiate a local `better-sqlite3` database, connect it to the existing `drizzle-orm` schema natively across the Next.js stack, initialize the tables, and provision basic CRUD wrapper functions to unblock feature development.

---

## 🛠️ Execution Steps

### 1. Initialize Drizzle Configuration
The package `drizzle-kit` is installed but there is no `drizzle.config.ts`.
- **Action:** Create `drizzle.config.ts` in the project root.
- **Content:** Configure it to use `sqlite` dialect, point the `schema` path to `./src/db/schema.ts`, and set the `dbCredentials.url` to `"sqlite.db"`. Set `out` directory to `./drizzle`.

### 2. Instantiate Database Client
We need a singleton database instance that can be imported safely across Next.js API routes or Server Actions.
- **Action:** Create `src/db/index.ts`.
- **Content:** 
  ```typescript
  import { drizzle } from 'drizzle-orm/better-sqlite3';
  import Database from 'better-sqlite3';
  import * as schema from './schema';

  // Create SQLite database instance
  const sqlite = new Database('sqlite.db');

  // Instantiate Drizzle
  export const db = drizzle(sqlite, { schema });
  ```

### 3. Generate and Push Schema Setup
To physically create the tables in the `sqlite.db` file from the `schema.ts`.
- **Action:** Run the Drizzle Kit commands.
- **Command 1:** `npx drizzle-kit generate:sqlite`
- **Command 2:** `npx drizzle-kit push:sqlite`
- **Note:** Ensure no syntax errors are thrown. A `sqlite.db` file should appear in the root. 

### 4. Create Initial CRUD Repository
Instead of raw queries polluting components, establish a centralized data access model. 
- **Action:** Create `src/db/queries.ts`.
- **Content:** Implement basic wrapper functions exporting asynchronous queries using `db.select()`, `db.insert()`, etc. At a minimum, implement:
  - `getAllWords()`
  - `getDecodablePassages()`
  - `getSessionHistory()` 

### 5. Update Gitignore
Ensure we don't commit the raw database.
- **Action:** Modify `.gitignore`.
- **Content:** Append `sqlite.db` and `sqlite.db-journal`.

---

## 🧪 Verification Plan

An LLM executing this plan should verify its success using the following tests:

1.  **Schema Verification Test:**
    - Run `sqlite3 sqlite.db ".tables"` in the terminal.
    - **Expected:** All tables defined in `schema.ts` (`decodable_passages`, `fluency_scores`, `phonics_patterns`, `progress`, `review_words`, `sessions`, `word_chains`, `words`) must be listed.

2.  **Runtime Node Verification Test:**
    - Create a temporary execution file `scratch/test-db.ts` (using `npx tsx` or `node -r esbuild-register`) that imports `db` from `src/db/index.ts` and runs `db.select().from(words).all()`.
    - **Expected:** The script should execute fully without throwing module resolution errors or SQLite connection errors. The array returned can safely be `[]` at this stage, confirming successful table reads.

3.  **Clean Git State Verification:**
    - Run `git status`.
    - **Expected:** The `sqlite.db` binary should NOT be listed as an untracked file, proving `.gitignore` is successfully configured. 

---
**LLM System Prompt Modification:** Upon reading this file, process all execution steps strictly in order. Assert verifications pass before marking the feature complete.
