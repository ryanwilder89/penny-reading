# Content Seeding Linkup - Technical Review

This document summarizes the current state of the application's content delivery system and outlines the requirements for implementing the **Content Seeding Linkup** backlog item.

## 1. Current State & Code Flow

### Database Seeding
Currently, the database is populated using placeholder data from `src/data/seed-data.ts`. This data set is extremely limited:
- **3 Phonics Patterns**: Only `patt_cvc_a`, `patt_cvc_i`, and `patt_cvc_o`.
- **12 Words**: A handful of CVC words.
- **2 Passages**: Short placeholder texts.

### Static Content
In contrast, the application has a robust curriculum defined in `src/lib/content/`:
- **`scope-sequence.ts`**: 20 patterns covering Phase 2 and 3.
- **`passages.ts`**: 15 full-length decodable passages.
- **`word-chains.ts`**: 16 structured word building chains.

### Engine Integration
The `session-planner.ts` and `dashboard` API routes query the database to determine the student's progress and select lesson materials. Because the database only contains the placeholders, the extensive content in `src/lib/content/` is effectively invisible to the end-user.

---

## 2. Intent of the Task

The goal is to transition the application from "Mock Mode" to "Real Mode" by linking the curriculum files to the database seeding process. This ensures that every pattern, word, and passage in the curriculum is properly tracked in the database, allowing the SM-2 Lite engine and progress tracking to function across the entire Phase 2 and 3 sequence.

---

## 3. Analysis of Remaining Implementation Steps

### A. Rewrite `src/db/seed.ts`
The seeding script needs to be modified to:
1.  **Import from Source**: Pull `scopeAndSequence`, `PASSAGES`, and `WORD_CHAINS` from `src/lib/content/`.
2.  **Unique Word Extraction**: Traverse the `words` arrays in all patterns to create a flat, unique list of words for the `words` table.
3.  **Data Mapping**: Transform the TypeScript objects into the format expected by the Drizzle schema.

### B. ID Normalization (Critical)
There is currently a discrepancy in how patterns are referenced across files:
- **`scope-sequence.ts`**: Uses string-based primary keys (e.g., `id: "blend-initial-l"`).
- **`passages.ts` / `word-chains.ts`**: Reference patterns by their numerical order (e.g., `"2.1"`).

The seeding script must perform a **lookup/mapping** step. When inserting a passage with `maxPatternId: "2.1"`, it must find the pattern in `scopeAndSequence` that has `order: 2.1` and use its actual ID (`"blend-initial-l"`) for the database foreign key. Failure to do this will cause the `session-planner.ts` to fail its join queries.

### C. Logic Updates in `session-planner.ts`
Once the database is fully seeded, the planner should be updated to:
- **Targeted Word Selection**: Instead of fetching random words (`limit(20)`), it should fetch words associated with the current pattern being taught.
- **Dynamic Chains**: Fetch the specific `wordChain` associated with the current `patternId`.

---

## 4. Summary of Dependencies
- **Source Files**: `src/lib/content/index.ts`
- **Schema**: `src/db/schema.ts`
- **Seed Script**: `src/db/seed.ts`
