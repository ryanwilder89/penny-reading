# Step 5: Engine Logic (Mastery & Spaced Repetition) Plan

**Context:** Based on `plan/implementation_priority.md`, this document outlines the instructions to implement Step 5. With session state successfully persisting, the application now needs to analyze the saved data to dynamically advance the curriculum and enforce spaced repetition of trouble words. 

> [!NOTE]
> The foundational logic for storing `troubleWords` into the `reviewWords` table was introduced during Step 4. Step 5 will expand on this by implementing spaced repetition intervals and mastery thresholds.

**Stack:** Next.js Server Components, Drizzle ORM, SQLite.
**Target Workspace:** `/Users/rwilder/Developer/penny-reading/penny-reading`

## 🎯 Goal
Upgrade the `session-planner.ts` to implement spaced repetition (SM-2 lite) for the Flashcard Review. Concurrently, implement a mastery algorithm that evaluates the child's historical `fluencyScores` to automatically graduate the active phonics pattern from `IN_PROGRESS` to `MASTERED` and unlock the next lesson.

---

## 🛠️ Execution Steps

### 1. Upgrade Spaced Repetition Logic (Flashcard Review)
The `reviewWords` table is currently receiving incorrect words, but the querying logic in `session-planner` needs to intelligently fetch words due for review.
- **Action:** Update `src/db/queries.ts` and `src/lib/engine/session-planner.ts`.
- **Content:** 
  - Create a query `getDueReviewWords()` that fetches from `reviewWords` where the `nextReviewDate` is less than or equal to today's date.
  - Update `generateSessionPlan()` to populate the `REVIEW` activity array dynamically using these due words.
  - Enhance `saveSessionResults()`: If a word is successfully reviewed *correctly*, increment its Spaced Repetition interval (e.g., 1 day -> 3 days -> 7 days) and push out its `nextReviewDate`. If it is reviewed *incorrectly*, reset its interval to 1 day.

### 2. Implement Mastery Evaluation Algorithm
After a session completes, we need to decide if Penny is ready to move to the next phonics pattern.
- **Action:** Create `src/lib/engine/mastery-evaluator.ts` (or expand existing engine logic).
- **Content:**
  - Create a function `evaluatePatternMastery(patternId: string)`.
  - The algorithm should query `fluencyScores` and/or `sessions` for the specific pattern.
  - Apply an accuracy threshold rule: e.g., "If the user resolves the Passage Reader with > 90% accuracy and > 40 WCPM over 2 consecutive sessions, mark as MASTERED."
  - Update the `progress` table: Change `status` to `MASTERED` and update the `dateMastered` timestamp.

### 3. Advance the Active Curriculum
If a pattern is mastered, the system must queue the subsequent pattern.
- **Action:** Update `getTodayLesson()` logic in `session-planner.ts`.
- **Content:**
  - When fetching the active lesson, look at the `progress` table. Sort the `phonicsPatterns` by `sequenceOrder`. Find the first pattern where status is NOT `MASTERED`, or initialize it as `IN_PROGRESS` if `NOT_STARTED`.
  - Ensure the frontend Dashboard reflects this new active pattern.

### 4. Hook Mastery Evaluation to Session Completion
The mastery check must fire automatically when a session ends.
- **Action:** Update `src/app/api/progress/session-complete/route.ts`.
- **Content:**
  - After calling `saveSessionResults()`, invoke `evaluatePatternMastery()` asynchronously.

---

## 🧪 Verification Plan

An LLM executing this plan should verify its success using the following tests:

1. **Spaced Repetition Integration:**
   - Execute a practice session. Manually set a word to due.
   - Run a new session generation. **Expected:** The flashcard array contains the scheduled review word.
2. **Mastery Threshold Test:**
   - Write a quick scratch script (in `/scratch`) or use the UI to log two consecutive high-accuracy (e.g. 95%), high WCPM sessions on a pattern.
   - **Expected:** The `progress` SQLite table updates the `status` to `MASTERED`.
3. **Curriculum Advancement Check:**
   - With a `MASTERED` pattern, load the Dashboard.
   - **Expected:** The UI displays the *next* sequential pattern in the curriculum.

---
**LLM System Prompt Modification:** Upon reading this file, process all execution steps strictly in order. Assert verifications pass before marking the feature complete.
