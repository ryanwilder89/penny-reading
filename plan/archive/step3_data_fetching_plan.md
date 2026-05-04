# Step 3: Real Data Fetching Hooks & API Routes Plan
**Context:** Based on `plan/implementation_priority.md`, this document provides highly specific, LLM-actionable instructions to implement Step 3: Real Data Fetching Hooks & API Routes. The database is now seeded with actual curriculum data, and we must replace the mocked frontend states with real database queries.

**Stack:** Next.js (App Router), `drizzle-orm`, React Hooks.
**Target Workspace:** `/Users/rwilder/Developer/penny-reading/penny-reading`

## 🎯 Goal
Replace frontend mocked arrays and hardcoded states with dynamic data. Build Next.js API Route Handlers (or Server Components) to query the database, then update the frontend components and the `session-planner` engine to consume these endpoints, fully hydrating the UI with realistic state.

---

## 🛠️ Execution Steps

### 1. Build API Routes for Dashboard Data
The dashboard needs data summarizing user progress, current phase, and historical fluency scores.
- **Action:** Create directory structure `src/app/api/dashboard`. Create `src/app/api/dashboard/route.ts`.
- **Content:** Implement a `GET` request handler using `NextResponse`. 
  - Query the database (via `src/db/queries.ts`) to get the latest progress state or active session.
  - Return the JSON structure required by `src/app/page.tsx` and related dashboard components.

### 2. Build API Routes for Session Planning
The session experience needs dynamic word lists and passages tailored to the active lesson phase.
- **Action:** Create directory structure `src/app/api/session/plan`. Create `src/app/api/session/plan/route.ts`.
- **Content:** Implement a `GET` handler. 
  - Determine the user's current working `phonicsPattern` phase.
  - Call the underlying database queries to retrieve the specific words and the target `decodablePassage`.
  - Return the structured session payload.

### 3. Update the Session Planner Engine
The existing `lib/engine/session-planner.ts` likely relies on static arrays. It must be refactored to either query the DB directly or handle the API response structure.
- **Action:** Modify `src/lib/engine/session-planner.ts`.
- **Content:** Refactor functions like `generateSessionPlan()` to execute database queries or accept the db records as arguments, ensuring it returns a cohesive session object dynamically constructed from the SQLite tables.

### 4. Hydrate Frontend Components
The React components in the dashboard and session flow must stop using mocked state.
- **Action:** Update `src/app/page.tsx` (Dashboard) and the main Session container component.
- **Content:** 
  - For Next.js Server Components, use direct imports from `src/db/queries.ts` to fetch data during SSR (e.g., in `page.tsx`).
  - For Client Components needing lifecycle specific data, implement `useEffect` with `fetch('/api/...')` or a data fetching library like `SWR`.
  - Pass the real fetched data as props to child visualization components (e.g., Skills Map, WCPM chart). Remove all legacy static mocked arrays.

---

## 🧪 Verification Plan

An LLM executing this plan should verify its success using the following tests:

1.  **API Route Verification Test:**
    - Run the development server in a background shell: `npm run dev`.
    - Execute a `curl` command to the new routes: `curl http://localhost:3000/api/dashboard` and `curl http://localhost:3000/api/session/plan`.
    - **Expected:** Both endpoints should return a valid HTTP 200 JSON payload containing data originally inserted by the database.

2.  **Frontend Render Test:**
    - Open the browser to `localhost:3000` (or write a quick automated script using `curl http://localhost:3000`).
    - **Expected:** The dashboard should render without server errors, and the data structures passed down to components should map correctly to the Next.js routes. No React runtime errors or hydration mismatches.

3.  **Type Safety Verification:**
    - Run `npx tsc --noEmit`.
    - **Expected:** The Typescript compilation should pass with 0 errors, validating that the frontend interfaces safely consume the Drizzle schema types and API payload types.

---
**LLM System Prompt Modification:** Upon reading this file, process all execution steps strictly in order. Assert verifications pass before marking the feature complete.
