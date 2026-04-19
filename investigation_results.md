# Investigation Summary: Lesson Advancement Bug

After a thorough review of the database state, the `/api/progress/session-complete` endpoint, the `session-planner` engine, and the frontend `SessionFlow` component, I have identified two distinct bugs that combine to prevent the dashboard from advancing to the next lesson.

### 1. React Stale Closure Bug in `SessionFlow.tsx` (Data Loss)
When a session is completed, your `fluencyStats` (WCPM and accuracy) are dropped entirely and are never sent to the backend. In `SessionFlow.tsx`, the `onComplete` handler for `PassageReader` looks like this:
```typescript
onComplete={(stats) => {
  setSessionLog(prev => ({ ...prev, fluencyStats: stats }));
  handleNext();
}}
```
Because `handleNext` is called immediately in the same tick as `setSessionLog`, it executes using the `sessionLog` from the *current* render closure—which still has `fluencyStats: null`.
When `handleNext` evaluates `currentStep < plan.activities.length - 1`, it sees this is the final step and runs `onSessionComplete(finalLog)`. The payload sent to your API contains `fluencyStats: null`. 

Because `fluencyStats` is missing, `saveSessionResults` (in `queries.ts`) skips inserting any rows into the `fluency_scores` table. Without `fluencyScores`, `evaluatePatternMastery` checks the history and always returns `false` (since it requires 2 recent scores above 90% accuracy and 40 WCPM). The pattern never gets flagged as `MASTERED`.

### 2. Hardcoded logic in `/api/dashboard/route.ts`
Even if `evaluatePatternMastery` successfully marked `patt_cvc_a` as `MASTERED`, the next lesson would still not display on the dashboard. In `/api/dashboard/route.ts` (around line 11), the logic is currently hardcoded:
```typescript
// 1. Get Today's Lesson (for MVP, fetch the lowest sequenceOrder pattern or one that is IN_PROGRESS)
// Here we'll just fetch the first pattern as standard.
const allPatterns = await db.select().from(phonicsPatterns).orderBy(asc(phonicsPatterns.sequenceOrder));
const currentPattern = allPatterns[0]; // <-- HARDCODED
```
It completely ignores the `progress` table and always selects the very first pattern (`patt_cvc_a`).

---

# Human Investigation & Verification Steps

To manually step through the code and confirm these issues, follow these instructions using your debugger. If you are using VS Code or Chrome DevTools, you can place breakpoints in these specific locations:

### Step 1: Verify the React Stale State
1. **Breakpoint Location:** `src/components/session/SessionFlow.tsx`, inside the `handleNext` function at line 31 (`const finalLog = { ...sessionLog, completedAt: Date.now() };`).
2. **Action:** Start a session for `patt_cvc_a` and rapidly click through the activities until you finish the 1-minute `PassageReader` activity.
3. **Variables to Watch:** Hover over `sessionLog` in your debugger. You will observe that `sessionLog.fluencyStats` is `null` instead of containing `{ wpm, accuracy, mistakes }`.

### Step 2: Verify the API Payload Drop
1. **Breakpoint Location:** `src/app/api/progress/session-complete/route.ts`, right after `const payload = await request.json();` (line 8).
2. **Action:** Resume execution from Step 1.
3. **Variables to Watch:** Inspect the `payload` variable. You will see that while `reviewedWords` and `troubleWords` are populated (because those steps occurred in earlier renders), `fluencyStats` is completely absent or `null`.

### Step 3: Verify the Database is Missing Fluency Scores
1. **Breakpoint Location:** `src/lib/engine/mastery-evaluator.ts`, inside the `evaluatePatternMastery` function at line 28 (`if (recentScores.length < 2) {`).
2. **Action:** Resume execution from Step 2.
3. **Variables to Watch:** Check the length of `recentScores`. It will be `0` (or `1` if you have any old mocked data), and the logic will immediately return `false`.

### Step 4: Verify Dashboard Hardcoded Selection
1. **Breakpoint Location:** `src/app/api/dashboard/route.ts`, at line 11 (`const currentPattern = allPatterns[0];`).
2. **Action:** Return to the dashboard.
3. **Variables to Watch:** Inspect `currentPattern`. You will notice it aggressively pulls `allPatterns[0]` and completely ignores the database's progress table (`progressReq`), which explains why the dashboard remains stuck on Lesson 1 regardless of mastery.
