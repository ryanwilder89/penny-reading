# Phase 1 Test Plan: Foundation

## Overview
This test plan verifies the **Phase 1: Foundation** completion criteria as outlined in the "Penny's Reading App -- Agentic Development Plan". 

**Phase 1 Exit Criteria:**
> "A parent can log in, see today's session, and run a word-building activity with real content for two-letter blends. Data is persisted."

---

## 1. Authentication & Setup
### 1.1 Simple PIN Entry
- **Action**: Open the web app URL.
- **Expected Result**: User is greeted with a simple PIN entry or password screen.
- **Action**: Enter an incorrect PIN.
- **Expected Result**: Access is denied with a simple error message.
- **Action**: Enter the correct PIN.
- **Expected Result**: User is successfully authenticated and redirected to the Daily Dashboard.

### 1.2 Placement / Calibration Flow (First-time use)
- **Action**: Log in as a new parent/user with no previous session data.
- **Expected Result**: The app presents the Phase 1 placement/calibration flow (quick-check assessment for letter sounds, short vowels, digraphs).
- **Action**: Complete the assessment. Mark some skills >=90% and some below 90%.
- **Expected Result**: Skills >=90% are marked MASTERED. Sub-90% skills are queued as REINFORCE lessons. User lands on the Daily Dashboard for their first lesson.

---

## 2. Daily Dashboard (Home Screen)
### 2.1 UI and Layout
- **Action**: View the Daily Dashboard.
- **Expected Result**: 
  - The UI is clean, tablet-first, and touch-friendly.
  - The currently scheduled "Today's Session" is prominently displayed (e.g., Phase 2, skill 2.1: two-letter blends).
  - A clear "START SESSION" button is visible and tapable (min 48x48px touch target).
  - Parent-facing elements are distinct from child-facing UI.

### 2.2 Content Retrieval
- **Action**: Inspect the scheduled lesson details.
- **Expected Result**: The scheduled lesson aligns with the scope and sequence data stored in the backend (Phase 2 skills 2.1 through 2.4 content should be present).

---

## 3. Word Building Activity
### 3.1 Initial State & Display
- **Action**: Start the session and enter the Word Building Activity.
- **Expected Result**: 
  - A parent prompt ("Say to Penny: ...") is visible and visually distinct.
  - Generous letter slots are provided for the target word.
  - A scrollable letter tile tray is visible at the bottom.
  - No text instructions for the child.

### 3.2 Drag & Drop / Tap-to-Place Functionality
- **Action**: Tap a letter tile in the tray, then tap a target slot.
- **Expected Result**: The letter successfully snaps into the chosen slot.
- **Action**: (If implemented) Drag a letter tile into a target slot.
- **Expected Result**: The tile smoothly tracks the finger/cursor and drops into place.

### 3.3 Answer Verification & Celebrations
- **Action**: Spell the word **incorrectly** and tap CHECK.
- **Expected Result**: The UI highlights the incorrect letter(s) and allows for a retry. After the retry, the correct answer is shown.
- **Action**: Spell the word **correctly** and tap CHECK.
- **Expected Result**: A brief (0.5 - 1 second) celebration animation fires (no sound effects) and the app advances to the next word.

### 3.4 Content Validation
- **Action**: Complete a sequence of Word Building words.
- **Expected Result**: The words correspond to Phase 2 skills 2.1 through 2.4 (two-letter initial blends like "clap", "crab", "skip") and distractors in the tile tray are phonetically plausible.

---

## 4. Backend & Data Persistence
### 4.1 State Persistence
- **Action**: Complete a partial Word Building activity. Refresh the page or close/reopen the browser.
- **Expected Result**: The session state is maintained (or the dashboard recognizes an incomplete session and offers to resume).
- **Action**: Complete the session entirely.
- **Expected Result**: The session data (time completed, words attempted, accuracy) is successfully stored in the database.
- **Action**: Return to the Daily Dashboard after session completion.
- **Expected Result**: The Dashboard accurately reflects that today's session has been completed, displaying recent progress correctly. 

---

## 5. Device Compatibility (Tablet First)
- **Action**: Emulate an iPad (landscape and portrait) using browser DevTools or a real device.
- **Expected Result**: 
  - Large tap targets hold up (letters >= 48px).
  - Substantial tap/hit areas on action buttons. 
  - The layout breaks down elegantly without horizontal scrollbars or squished elements.
