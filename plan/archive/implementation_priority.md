# Implementation Plan: Remaining Features

Based on the current state of the application, there are several foundational features that have not yet been implemented. To transition this project from a static frontend prototype to a fully functional application, we must implement these missing pieces.

This document outlines the priority order for tackling the remaining "Not Yet Implemented" features.

## Step 1: Database Connection & Operations 
**Priority:** Critical / Blocker
**Dependency:** None

Before the application can do anything dynamic, it needs a real database to read from and write to. The Drizzle ORM schemas are already defined in `src/db/schema.ts`, but the actual connection string, database client instantiation, and wrapper queries are missing.

**Tasks:**
- Set up the SQLite database (e.g., `sqlite.db` file or a libsql local instance).
- Create a `src/db/index.ts` to instantiate the Drizzle client.
- Write basic repository/CRUD functions to interact with the database tables.

## Step 2: Content Seeding Script
**Priority:** High
**Dependency:** Database Connection

Our MVP relies on static, pre-loaded content (scope and sequence, word lists, and decodable passages). We cannot build data fetching or session logic without real data sitting in the database.

**Tasks:**
- Create a script (e.g., `npm run seed`) capable of parsing JSON or CSV files containing the curriculum data.
- Execute the script to populate the `phonicsPatterns`, `words`, and `decodablePassages` tables so that they are ready for the app to consume.

## Step 3: Real Data Fetching Hooks & API Routes
**Priority:** High
**Dependency:** Content Seeding

With a seeded database, we can replace the mocked data arrays in our frontend components with real data. 

**Tasks:**
- Implement Next.js API routes under `src/app/api/...` to serve dashboard state, session plans, and user progress.
- Update `src/app/page.tsx` and the dashboard components to fetch real data (e.g., current Phase, scheduled lesson, historical WCPM scores) and hydrate the UI.
- Update `lib/engine/session-planner.ts` to query the database and construct a real session plan based on the active lesson phase.

## Step 4: State Persistence & Event Handlers
**Priority:** Medium
**Dependency:** Data Fetching Hooks

Once a user starts a session populated with real data, their interactions must be recorded. When a session finishes, the results must be written back to the database.

**Tasks:**
- Add state-tracking to the interactive components in `SessionFlow.tsx` (e.g., logging correct/incorrect answers in the `WordBuilding` or `FlashcardReview` modules).
- Build the API endpoint (e.g., `/api/progress/session-complete`) to accept a payload of the session's results.
- Ensure the frontend successfully POSTs this data and redirects back to the updated Dashboard.

## Step 5: Engine Logic (Mastery & Spaced Repetition)
**Priority:** Medium / Iterative
**Dependency:** State Persistence

This wraps the feedback loop. Now that session data is being persisted to the database, our business logic needs to analyze it to adjust Penny's future curriculum path.

**Tasks:**
- Implement algorithms to evaluate if an accuracy threshold (e.g., 90%) has been met to promote a structural pattern from `IN_PROGRESS` to `MASTERED`.
- Build the mechanism to intercept incorrect answers (trouble words) and automatically queue them into the `reviewWords` table for the next day's session.
- Ensure the `session-planner` incorporates these queued review words into the "Flashcard Review" activity dynamically.
