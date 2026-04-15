# Current State Summary: Penny's Reading App Phase 1

This document outlines the current state of "Penny's Reading Practice," categorized by what is fully working, what is currently stubbed or mocked, and what has not yet been implemented according to the Phase 1 goals.

## 🟢 Working (Implemented)

The application currently exists as a **high-fidelity static frontend prototype**. The core UI structure and navigation are in place to demonstrate the user flow.

*   **Application Shell & Routing:** Next.js routing is functional, cleanly navigating the user between the Dashboard (`/`), Placement (`/placement`), active Session (`/session`), and Settings (`/settings`).
*   **UI Components & Styling:** The application successfully employs a tablet-first, touch-friendly UI using Tailwind CSS. 
*   **Drag-and-Drop functionality:** The `WordBuilding` component correctly leverages `@dnd-kit` to allow a letter tile to be dragged or tapped into a target slot, evaluating if it is the correct drop target.
*   **Database Schema:** The data models logic is defined via Drizzle ORM in `src/db/schema.ts` (Tables for patterns, words, sessions, fluency, and progress exist).
*   **Project Initialization:** React, TypeScript, and the standard Next.js directory structure (`src/app`, `src/components`, `src/lib`) are correctly established.

---

## 🟡 Stubbed (Mocked)

Many features have user interfaces built but rely on hard-coded static data rather than backend logic.

*   **Authentication & Login:** The landing page presents a mocked login choice ("Log in as New User" vs "Log in as Existing User") rather than real authentication routes or user persistence. (Note: PIN is intentionally excluded per design).
*   **Daily Dashboard State:** The streak counter, current scheduled lesson, and complex visualizations (`WcpmChart`, `GrowthRate`, `SkillsMap`) render correctly but are fed static, hardcoded datasets within `page.tsx`.
*   **Session Engine & Planner:** The `generateSessionPlan` in `lib/engine/session-planner.ts` returns a static array of mock activity types rather than evaluating the database to determine dynamic needs based on mastery or scheduled reviews.
*   **Session Content:** The activity components used in `SessionFlow.tsx` (e.g., `PhonemicWarmup`, `FlashcardReview`, `WordChain`, `PassageReader`) are fully styled but receive static string props and mock passages.
*   **Settings Preferences:** The settings page allows UI state changes (dropdown selection, tapping save) but does not actually update an underlying user profile or DB.
*   **Placement Assessment:** The `placement` page visually displays an assessment prompt ("cat") but user interaction ("Correct" / "Incorrect") does not calculate a placement tier or persist data.

---

## 🔴 Not Yet Implemented

These are the primary critical paths required to complete Phase 1 and transition to Phase 2:

*   **Database Connection & Operations:** While the schema exists, there is no active SQLite database file or implementation of the CRUD operations required to read/write state.
*   **Content Seeding:** A mechanism or script to import the fundamental Phase 1 and Phase 2 curriculum data (words lists, decodable passages) into the database is missing. 
*   **State Persistence & Event Handlers:** Tracking the user's progress through an active session, calculating their accuracy, resolving the session, and writing that event to the database.
*   **Engine Logic (Mastery & Spaced Repetition):** The algorithmic logic to promote a skill from "IN_PROGRESS" to "MASTERED", or to automatically queue error words back into the next session's review deck.
*   **Real Data Fetching hooks:** Connecting the components to `src/app/api/...` paths via SWR / React Query, or fetching directly via server components to hydrate the Dashboard with the latest database state.
