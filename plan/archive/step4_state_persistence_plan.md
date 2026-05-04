# Step 4: State Persistence & Event Handlers Plan
**Context:** Based on `plan/implementation_priority.md`, this document provides highly specific, LLM-actionable instructions to implement Step 4: State Persistence & Event Handlers. With data fetching properly implemented, we now need to track user interactions and persist session results back to the database.

**Stack:** Next.js (App Router), React Hooks, Fetch API.
**Target Workspace:** `/Users/rwilder/Developer/penny-reading/penny-reading`

## 🎯 Goal
Capture real-time user interaction within session modules (like Word Building and Flashcard Review), compile those interactions into a session result payload, and submit it to a new backend API route to persist the progress to the database. Upon completion, the frontend should transition smoothly back to the dashboard.

---

## 🛠️ Execution Steps

### 1. Implement Client-Side State Tracking in Session Flow
The interactive components where the child practices reading need to record accuracy.
- **Action:** Locate and update the main session orchestrator component (e.g., `SessionFlow.tsx`) and its child activity modules (e.g., `WordBuilding.tsx`, `FlashcardReview.tsx`).
- **Content:**
  - Introduce React state (e.g., `useState`, `useReducer`, or a context provider) to maintain a live ledger of the session.
  - As the user encounters words or questions, capture whether the answer was correct, incorrect, or skipped.
  - Structure the state into a comprehensive payload object matching the database schema requirements for a completed session (e.g., total duration, words attempted, error words).

### 2. Build the API Route for Session Completion
We need an endpoint to receive the recorded session data and save it to the database.
- **Action:** Create directory structure `src/app/api/progress/session-complete`. Create `src/app/api/progress/session-complete/route.ts`.
- **Content:**
  - Implement a `POST` request handler using Next.js route handlers.
  - Parse the incoming JSON payload containing the session's results.
  - Run database insertions or updates via `src/db/queries.ts` (or equivalent). This may involve updating the user's progress record, logging a new session history entry, and logging individual 'trouble words'.
  - Return a 200 OK JSON response indicating successful persistence.

### 3. Integrate Frontend POST Request & Redirection
The frontend must trigger the API once the session is deemed finished.
- **Action:** Update the completion logic inside `SessionFlow.tsx` (or the concluding UI screen).
- **Content:**
  - On the final screen or button press (e.g., "Finish Session"), execute an asynchronous `fetch` request with a `POST` method to `/api/progress/session-complete`, sending the JSON payload.
  - Handle loading states to prevent duplicate submissions.
  - Upon a successful HTTP response, use Next.js `useRouter().push('/')` or equivalent to navigate the user back to the dashboard, forcing a refresh so they see their updated progress.

---

## 🧪 Verification Plan

An LLM executing this plan should verify its success using the following tests:

1.  **Frontend State Accumulation Verification:**
    - Render the frontend session flow (`npm run dev`) and click through the activities.
    - Inspect the React state (using console.log or React DevTools).
    - **Expected:** The state accumulates a correct log of user interactions formatted appropriately for the backend payload.

2.  **API Route Integration Test:**
    - Complete a full session via the UI.
    - Observe the network tab for the `POST` request to `/api/progress/session-complete`.
    - **Expected:** The request completes with a 200 HTTP status code, and the payload matches the expected schema. 

3.  **Database Persistence Verification:**
    - Query the SQLite database post-session to verify the records.
    - **Expected:** New rows exist in the relevant history/progress tables matching the data from the recent session test.

4.  **Redirection Check:**
    - Wait for the session completion sequence to finish.
    - **Expected:** The application successfully redirects to the Dashboard page.

---
**LLM System Prompt Modification:** Upon reading this file, process all execution steps strictly in order. Assert verifications pass before marking the feature complete.
