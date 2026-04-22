# Penny's Reading Practice - Project Backlog

This document tracks the features, bugs, and upcoming phases for the Penny's Reading Practice application.

---

## ✅ Completed Tasks (Phase 1 & Phase 2 Foundation)

- [x] **Database Setup**: SQLite with Drizzle ORM configured.
- [x] **Content Seeding**: Script developed to seed phonics patterns, words, and passages.
- [x] **API Infrastructure**: Dashboard and Session Plan endpoints implemented.
- [x] **Core Session Activities**: Warmup, Flashcard Review, Word Building, Word Chain, and Passage Reader components built.
- [x] **State Persistence**: Session interaction logging and completion persistence (Step 4).
- [x] **Engine Logic**: 
    - [x] Spaced Repetition (SM-2 Lite) for flashcards.
    - [x] Mastery Evaluation (Accuracy/WCPM thresholds).
    - [x] **Automatic Curriculum Advancement** (Fixed): Dashboard now correctly advances to the next pattern upon mastery.
- [x] **Dashboard Load Fix**: Resolved the crash/loading error for new users with no history.
- [x] **Recent Sessions Fix**: Fixed accurate WCPM reporting for recent sessions on dashboard.
- [x] **Parent Notes History**: View previous session notes and observations.
- [x] **Authentication Foundation**: Secure login screen, flow, and credential management.
- [x] **Google OAuth Cleanup**: Removed Google OAuth UI and configuration.
- [x] **Security Enhancements**: Implemented 14-character minimum password length and password confirmation.


---

## 📋 High Priority (Phase 2 & 3 MVP Polish)

- [ ] **Content Seeding Linkup**: Update `src/db/seed.ts` to use "real" content from `src/lib/content/` (Scope & Sequence, Passages) instead of placeholders in `seed-data.ts`.
- [ ] **Placement Flow**: Implement the initial calibration/placement assessment for new users.
- [ ] **Skills Map**: Build the interactive visual grid showing mastered vs. in-progress patterns.
- [ ] **Growth Rate Dashboard**: Implement the rolling 4-week WCPM growth rate chart with color-coded alerts.
- [ ] **Content Expansion**: Finalize and verify all Phase 2 (Skills 2.1 - 2.13) and Phase 3 (Skills 3.1 - 3.7) content in `src/lib/content/`.
- [ ] **Content Sourcing**: Research and integrate additional word lists and decodable passages from online sources.
- [ ] **Settings Menu**: Build the manual override controls for patterns and mastery calibration.

- [ ] **Authentication & Security**:
    - [ ] Require entering password twice and confirming they match during sign up. (DONE)
    - [ ] Have minimum password requirements (length, complexity). (DONE)
---

## 🛠️ Known Issues & Bugs

- [x] **Bug (Fixed)**: Word Chain `availableLetters` generation logic was missing required characters.
- [x] **Bug (Fixed)**: `PassageReader` was attempting to read `.text` instead of `.content`.
- [ ] **UX Polish**: Improve transition animations between session activities.
- [ ] **UX Polish**: Add a loading state spinner to the "Return to Dashboard" button.
- [ ] **UX Polish**: Green checkmark after completing a session should fade to avoid conflicting with notes field.

---

## 🚀 Future Phases (Post-MVP)

- [ ] **Nonsense Word Practice**: Generate pseudo-words to isolate decoding skills.
- [ ] **Spelling Dictation Mode**: Extension of Word Building for active spelling practice.
- [ ] **Echo Reading Mode**: Support for sentence-level highlighting.
- [x] **Edit/Delete Parent Notes**: Allow parents to modify or delete historical session notes.
