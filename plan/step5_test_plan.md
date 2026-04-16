# Test Plan: Step 5 Engine Logic (Mastery & Spaced Repetition)

This test plan provides manual steps to verify that the adaptive curriculum and spaced repetition logic are functioning correctly.

## 🛑 Prerequisites
1. Ensure the dev server is running: `npm run dev`.
2. Ensure you have completed Step 1 through Step 4.

---

## 🧪 Test Case 1: Spaced Repetition (Failed Word)
**Goal:** Verify that a missed word is scheduled for tomorrow.

1.  **Action:** Start a session.
2.  **Activity:** In the "Flashcard Review", mark a specific word (e.g., "clap") as **INCORRECT**.
3.  **Action:** Finish the session and return to the dashboard.
4.  **Verification (Database):** Run the following command in your terminal:
    ```bash
    sqlite3 sqlite.db "SELECT word, next_review_date, times_missed FROM review_words WHERE word = 'clap';"
    ```
    - **Expected:** `next_review_date` should be tomorrow's date, and `times_missed` should have increased.

---

## 🧪 Test Case 2: Spaced Repetition (Correct Word)
**Goal:** Verify that a correctly answered review word is pushed out into the future.

1.  **Action:** Start a session.
2.  **Activity:** Mark that same word ("clap") as **CORRECT**.
3.  **Action:** Finish the session.
4.  **Verification (Database):** Run the command again:
    ```bash
    sqlite3 sqlite.db "SELECT word, next_review_date FROM review_words WHERE word = 'clap';"
    ```
    - **Expected:** `next_review_date` should now be approximately **3 days from today**.

---

## 🧪 Test Case 3: Mastery Evaluation & Advancement
**Goal:** Verify that 2 high-performance sessions unlock the next pattern.

1.  **Action:** Note the current lesson on your Dashboard (e.g., "Short a").
2.  **Session 1:** Start a session and complete the **Passage Reader** with:
    - **Accuracy:** 100% (No mistakes tapped).
    - **WCPM:** High (> 40).
3.  **Session 2:** Start the session *again* (on the same pattern) and complete the **Passage Reader** with exactly the same high scores.
4.  **Verification (UI):** Return to the Dashboard.
    - **Expected:** The "TODAY'S SESSION" box should now show the **next** phonics pattern in the sequence (e.g., "Short i" or "Short o").
5.  **Verification (Database):** 
    ```bash
    sqlite3 sqlite.db "SELECT status FROM progress WHERE pattern_id = '[INSERT_PREVIOUS_PATTERN_ID]';"
    ```
    - **Expected:** Status should be `MASTERED`.

---

## 🧪 Test Case 4: Automated Review Word Injection
**Goal:** Verify that the "Flashcard Review" activity pulls from the database.

1.  **Action:** Manually insert a "due" word into the database (or just use one you missed in Test Case 1).
2.  **Action:** Start a session.
3.  **Verification (UI):** Look at the words in a **Flashcard Review**.
    - **Expected:** The word you missed previously ("clap") should appear in the stack today.

---
