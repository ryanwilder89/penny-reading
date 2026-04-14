# Penny's Reading App -- Agentic Development Plan

> **Purpose of this document:** This is an AI-consumable specification for building a parent-guided reading intervention app. It is written for agentic coding tools (Antigravity, Gemini, Claude Code, Cursor, etc.) to use as a primary reference when generating code, making architectural decisions, and implementing features. Every section is structured to reduce ambiguity and provide the context an AI agent needs to produce correct output on the first pass.

---

## 1. Product Summary

**App name:** Penny's Reading Practice (working title)

**One-line description:** A tablet-first web app that delivers structured, daily phonics lessons and oral reading fluency practice for a 6-year-old, guided by a parent in 10-20 minute sessions.

**Primary user:** A parent (either of two parents) sitting with a 6-year-old child, running a structured reading session on a tablet.

**Core problem:** Penny (age 6, 1st grade) scores at the 21st national percentile in early literacy. Her decoding and fluency are weak; her comprehension and vocabulary are strong. Her school's Personal Reading Plan (PRP) is not being actively implemented. This app is her primary structured at-home intervention, complementing (not duplicating) the Lexia Core5 adaptive program she uses at school.

**What this app does that Lexia Core5 cannot:**
- Oral reading fluency practice (requires a human listener to mark accuracy)
- Parent-guided word building with physical interaction
- A scope and sequence tied directly to Penny's PRP skill gaps
- Full parent visibility into progress data

---

## 2. Technical Architecture

### Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React (TypeScript) + Tailwind CSS | Tablet-first SPA. Touch-friendly. Large tap targets. |
| Backend | Node.js or Python (FastAPI) | Lightweight API for auth, data persistence, session state. |
| Database | PostgreSQL or SQLite (if self-hosted) | Relational data: sessions, scores, lesson progress, word lists. |
| Hosting | Developer's personal domain/server | No multi-tenant complexity. Single-family use. |
| Auth | Simple PIN or password | Family use only. No OAuth, no user registration flow. |
| Audio | None in MVP | Parent provides auditory modeling in person. |

### Key Constraints

- **Tablet-first responsive design.** Minimum touch target: 48x48px. Large text (24px+ for child-facing content). High contrast.
- **Always-online.** No offline support needed.
- **Two-parent continuity.** Both parents must see the same session state, progress data, and "what to do today" view. All state is server-side.
- **No speech-to-text.** Accuracy assessment is parent-driven (tapping missed words, marking correct/incorrect).
- **No TTS or recorded audio in MVP.** The parent is the audio model.
- **Content is static/pre-loaded for MVP.** Word lists and passages are stored in the database or as JSON files, not generated dynamically.

### Data Model

```
Phonics_Pattern {
  id: string               // e.g., "blend-cl", "cvce-a_e", "vowel-team-ai-ay"
  name: string             // e.g., "Two-letter blends: cl, bl, cr, st"
  phase: enum              // PHASE_2 | PHASE_3
  sequence_order: int      // Global ordering for scope and sequence
  description: string      // Brief description for parent reference
  parent_script: string    // What the parent says/does to teach this pattern
}

Word {
  id: string
  text: string             // e.g., "clap"
  pattern_ids: string[]    // Which patterns this word practices
  is_nonsense: boolean     // For nonsense word practice (post-MVP)
  frequency_list: string?  // "dolch-preprimer" | "dolch-primer" | "fry-100" | null
}

Word_Chain {
  id: string
  pattern_id: string       // Primary pattern being practiced
  words: string[]          // Ordered sequence, e.g., ["cat", "bat", "bit", "sit"]
  change_positions: int[]  // Which phoneme position changes at each step (0-indexed)
}

Decodable_Passage {
  id: string
  title: string
  text: string             // The passage content (50-100 words)
  word_count: int
  max_pattern_id: string   // Highest pattern required (determines when passage unlocks)
  patterns_used: string[]  // All patterns present in this passage
}

Lesson {
  id: string
  sequence_order: int
  pattern_id: string       // The pattern this lesson introduces or reinforces
  type: enum               // INTRODUCE | REINFORCE | REVIEW
  warmup_activity: object  // Phonemic awareness activity config
  teach_activity: object   // New pattern instruction config
  practice_activity: object // Word building / word chain config
  read_activity: object    // Decodable passage config
  estimated_minutes: int   // 10-15 weekday, 20-25 weekend
}

Session {
  id: string
  date: date
  lesson_id: string
  started_at: timestamp
  completed_at: timestamp?
  parent_id: string        // Which parent ran the session
  activities_completed: object[] // Per-activity results
}

Fluency_Score {
  id: string
  date: date
  passage_id: string
  reading_number: int      // 1st, 2nd, 3rd reading of this passage
  total_words: int
  errors: int              // Words marked incorrect by parent
  wcpm: float              // (total_words - errors) / time_in_minutes
  accuracy_pct: float      // (total_words - errors) / total_words * 100
  time_seconds: int
}

Progress {
  pattern_id: string
  status: enum             // NOT_STARTED | IN_PROGRESS | MASTERED
  accuracy_history: float[] // Rolling accuracy scores
  date_introduced: date
  date_mastered: date?
  mastery_criteria_met: boolean // 3 consecutive sessions at 90%+ accuracy
}
```

---

## 3. Phonics Scope and Sequence

This is the instructional backbone of the app. The sequence is derived from UFLI Foundations and calibrated to Penny's PRP skill gaps. She is at the "Full Alphabetic: Late" encoding phase, straddling Phase 2 and Phase 3.

### Phase 1 (Review/Confirm -- rapid assessment, not full teaching)

Penny likely has Phase 1 mostly solid. The app should include a brief placement check, not full lessons, for these:

- All 26 letter sounds
- Short vowels (a, e, i, o, u) in CVC words
- Consonant digraphs: sh, ch, th, wh, ck
- Double final consonants: ff, ll, ss, zz

**Implementation note:** The placement flow presents 5-10 words per sub-skill. If the parent marks 90%+ correct, the skill is marked MASTERED and skipped. If below 90%, it is queued as a REINFORCE lesson before moving to Phase 2.

### Phase 2 (Core instruction begins here)

Teach in this order. Each skill gets 2-4 lessons (INTRODUCE, then 1-3 REINFORCE) before advancing.

| Order | Skill | Example Words | PRP Alignment |
|---|---|---|---|
| 2.1 | Two-letter initial blends: bl, cl, fl, gl, pl, sl | clap, flag, sled, plum, glad, blot | PRP #7 |
| 2.2 | Two-letter initial blends: br, cr, dr, fr, gr, pr, tr | crab, drum, frog, trip, grin, brat | PRP #7 |
| 2.3 | Two-letter initial blends: sc, sk, sm, sn, sp, st, sw | skip, snap, stem, swim, spot, scan | PRP #7 |
| 2.4 | Final blends: -nd, -nk, -nt, -mp, -ft, -lt, -lk, -sk | hand, sink, jump, left, milk, desk | PRP #7 |
| 2.5 | CCVCC closed syllables | blink, stamp, trust, blend, crisp | PRP #5 |
| 2.6 | Three-letter blends: spr, str, scr, spl, shr, thr | spring, strap, scrub, split, shred | PRP #6 |
| 2.7 | CVCe / silent-e (a_e) | make, cake, lane, tape, game, safe | PRP #1 |
| 2.8 | CVCe / silent-e (i_e) | bike, time, five, ride, kite, line | PRP #1 |
| 2.9 | CVCe / silent-e (o_e, u_e, e_e) | rope, home, cube, tune, Pete | PRP #1 |
| 2.10 | CVC vs CVCe contrast drills | cap/cape, bit/bite, hop/hope, tub/tube | PRP #1 |
| 2.11 | Suffixes: -s, -es | cats, boxes, wishes, dogs, dresses | PRP #4 |
| 2.12 | Suffixes: -ing (no change) | jumping, running, helping, playing | PRP #4 |
| 2.13 | Suffixes: -ed (/t/, /d/, /ed/) | jumped, played, wanted, liked | PRP #4 |

### Phase 3 (Advanced first grade)

| Order | Skill | Example Words | PRP Alignment |
|---|---|---|---|
| 3.1 | Vowel teams: ai, ay | rain, play, train, stay, wait, say | PRP #2 |
| 3.2 | Vowel teams: ee, ea | tree, read, sleep, beach, green | PRP #2 |
| 3.3 | Vowel teams: oa, ow (long o) | boat, snow, road, grow, coat | PRP #2 |
| 3.4 | Vowel teams: ew, ue | blew, glue, threw, true, new | PRP #2 |
| 3.5 | R-controlled: ar | car, star, park, farm, shark | PRP #3 |
| 3.6 | R-controlled: or | fork, corn, sport, storm, shore | PRP #3 |
| 3.7 | R-controlled: er, ir, ur | her, bird, turn, fern, girl, burn | PRP #3 |

### Mastery Criteria

A pattern is marked MASTERED when the child achieves **90%+ accuracy across 3 consecutive sessions** on words containing that pattern (in both word-reading and word-building activities). If accuracy drops below 80% on a previously mastered skill during cumulative review, it is re-queued as a REINFORCE lesson.

---

## 4. Session Structure

Every session follows the same 4-part architecture. Predictability is intentional: it reduces cognitive load for both parent and child.

### Weekday Session (10-15 minutes)

```
WARMUP (2-3 min)
  - 1 Kilpatrick-style phonemic manipulation activity (oral, no screen needed)
    Examples: "Say 'stop.' Now say it without the /s/." "Say 'flat.' Change /f/ to /s/."
  - The app displays the prompt for the parent to read aloud.
  - Parent marks correct/incorrect. Push for responses within 2 seconds.
  - 8-12 items per activity.

REVIEW (2-3 min)
  - Quick flashcard-style word reading: 12-15 words from previously taught patterns.
  - Words appear one at a time. Large text. Parent taps "correct" or "incorrect."
  - Mix of current pattern words (20-30%) and cumulative review words (70-80%).

PRACTICE (3-5 min)
  - EITHER a word-building activity (letter tiles) OR a word-chain activity.
  - Alternates by session. Word building on odd sessions, word chains on even.
  - 5-10 words per activity.
  - For new INTRODUCE lessons, this is where the new pattern is explicitly taught.
    The app shows the parent script: what to say, what to model, what to have Penny do.

READ (3-5 min)
  - Decodable passage reading with timer.
  - Passage uses only patterns Penny has been taught (controlled text).
  - Parent starts timer, Penny reads aloud, parent taps any word she misses.
  - App calculates WCPM and accuracy after the reading.
  - If accuracy < 95%, re-read the same passage (up to 3 readings).
  - If accuracy >= 95% on first read, move to a new passage next session.
```

### Weekend Session (20-25 minutes)

Same 4-part structure, with expanded PRACTICE and READ sections:

```
WARMUP (2-3 min) -- same as weekday

REVIEW (3-4 min) -- slightly longer, more cumulative review words

PRACTICE (6-8 min)
  - Both word building AND word chains in the same session.
  - Can also include a spelling/encoding component:
    parent says a word, Penny builds it with letter tiles on screen.

READ (8-10 min)
  - Two passage readings: one repeated (from a previous session) and one new.
  - The repeated passage targets performance criterion (beat previous WCPM).
  - The new passage introduces the current lesson's pattern in context.
```

### Weekly Schedule

| Day | Session Type | Duration |
|---|---|---|
| Monday | Weekday | 10-15 min |
| Tuesday | Weekday | 10-15 min |
| Wednesday | Weekday | 10-15 min |
| Thursday | OFF | -- |
| Friday | Weekday | 10-15 min |
| Saturday OR Sunday | Weekend | 20-25 min |

5 sessions per week. Thursday is always off. One weekend day is a rest day (flexible).

---

## 5. Feature Specifications

### 5.1 Daily Dashboard (Home Screen)

**What the parent sees when they open the app:**

```
+------------------------------------------+
|  Penny's Reading Practice                |
|  Tuesday, April 15                        |
|                                          |
|  TODAY'S SESSION                          |
|  Lesson 14: Silent-e (i_e)              |
|  Type: Reinforce                          |
|  Est. time: 12 min                        |
|                                          |
|  [  START SESSION  ]                      |
|                                          |
|  RECENT PROGRESS                          |
|  Last session: Mon Apr 14 - 13 min        |
|  WCPM: 28 (accuracy: 94%)                |
|  Streak: 8 sessions                      |
|                                          |
|  QUICK ACTIONS                            |
|  [ Fluency Check ]  [ Free Practice ]    |
+------------------------------------------+
```

**Key behaviors:**
- Automatically determines "today's lesson" based on the scope and sequence and what has been completed.
- Shows which parent ran the last session and when.
- If today is Thursday (off day), shows a rest message with an optional "bonus practice" button.
- If the previous session was not completed, offers to resume or restart.

### 5.2 Word Building Activity

**Screen layout:**

```
+------------------------------------------+
|  Build the word:                          |
|                                          |
|  Parent says: "clap"                      |
|  (parent reads this prompt aloud)        |
|                                          |
|  [  ][  ][  ][  ]    <- letter slots      |
|                                          |
|  [ c ][ l ][ a ][ p ][ s ][ t ][ r ]    |
|  [ b ][ d ][ e ][ f ][ g ][ h ][ i ]    |
|  <- scrollable letter tile tray           |
|                                          |
|  [  CHECK  ]                              |
+------------------------------------------+
```

**Behavior:**
- Parent reads the target word aloud (app displays it for the parent only, hidden from the child by default -- parent can toggle).
- Penny drags letter tiles into slots to spell the word.
- Tap CHECK to verify. Correct: celebration animation + move to next word. Incorrect: highlight the wrong letter(s), give one retry, then show the correct answer.
- Letter tile tray contains the correct letters plus 4-6 distractors. Distractors should be phonetically plausible (e.g., for "clap," include 'k' and 'b' as distractors, not 'z' and 'x').
- Touch targets: minimum 48x48px, ideally 56x56px for letter tiles.
- Support both drag-and-drop and tap-to-place (tap tile, then tap slot).

### 5.3 Word Chain Activity

**Screen layout:**

```
+------------------------------------------+
|  Word Chain                              |
|                                          |
|  Current word:  [ c ][ a ][ t ]          |
|                                          |
|  Change it to:  "bat"                    |
|  (parent reads this aloud)              |
|                                          |
|  Available letters:                      |
|  [ b ][ h ][ s ][ p ]                    |
|                                          |
|  Tap the letter to change, then          |
|  tap the new letter.                      |
+------------------------------------------+
```

**Behavior:**
- Starts with a word displayed in letter tiles.
- Parent reads the next word in the chain.
- Penny taps the letter that needs to change, then taps the replacement from available options.
- Correct: the word updates, brief celebration, next word in chain appears as target.
- Incorrect: the tile bounces back. "Which sound changed? Listen again." Parent re-reads.
- Chain length: 5-10 words per activity.
- Available replacement letters: the correct letter plus 2-3 distractors.

**Example chains by phase:**

Phase 2 blends:
`flat -> flap -> flip -> clip -> slip -> slop -> stop`

Phase 2 CVCe:
`cap -> cape -> tape -> tap -> tip -> time -> lime`

Phase 3 vowel teams:
`rain -> ran -> pan -> pain -> gain -> grain`

### 5.4 Decodable Passage Reader

**Screen layout:**

```
+------------------------------------------+
|  "The Big Red Sled"                      |
|  Passage 14 | Patterns: blends, CVC      |
|                                          |
|  Sam had a big red sled. He went         |
|  to the hill with his dog, Rex.          |
|  "Let us go fast!" said Sam.            |
|  The sled slid down the hill.            |
|  Rex ran and ran. Sam was glad.          |
|                                          |
|  [  START TIMER  ]                        |
|                                          |
|  Tap any word Penny misses or            |
|  reads incorrectly.                      |
+------------------------------------------+
```

**During reading (timer running):**

```
+------------------------------------------+
|  Reading... 0:34                          |
|                                          |
|  Sam had a big red sled. He went         |
|  to the hill with his dog, Rex.          |
|  "Let us go fast!" said Sam.            |
|  The [sled] slid down the hill.          |
|  Rex ran and ran. Sam was [glad].        |
|                                          |
|  [  STOP  ]                              |
|                                          |
|  Tapped words marked as errors:          |
|  sled, glad                              |
+------------------------------------------+
```

**Behavior:**
- Text displayed in large, clear font (minimum 28px). High line spacing (1.8+).
- Words are individually tappable.
- Parent starts timer, Penny reads aloud. Parent taps any word she misses or reads wrong.
- Tapped words get a subtle highlight (not distracting to the child). Tapping again un-marks.
- STOP button ends the timer.
- Post-reading summary: WCPM, accuracy %, list of error words.
- If accuracy < 95%: prompt to re-read (same passage). "Let's try again! You got [X] out of [Y] words right."
- If accuracy >= 95%: "Great reading! You got [X] words per minute with [Y]% accuracy."
- Error words are automatically added to the next session's review flashcard pool.
- Support for "where did she stop?" -- if Penny doesn't finish the whole passage in 1 minute, parent taps the last word she read. WCPM is calculated based on words read, not total passage length.

### 5.5 Phonemic Awareness Warmup

**Screen layout:**

```
+------------------------------------------+
|  Warmup: Sound Swap                      |
|                                          |
|  Say to Penny:                            |
|                                          |
|  "Say 'stop.'                            |
|   Now say it without the /s/."           |
|                                          |
|  Answer: "top"                            |
|  (tap to reveal)                          |
|                                          |
|  [ CORRECT ]        [ INCORRECT ]        |
|                                          |
|  4 of 10                                  |
+------------------------------------------+
```

**Behavior:**
- The app generates the prompt. The parent reads it aloud.
- This is an oral activity. Penny responds verbally, not on screen.
- Parent taps CORRECT or INCORRECT based on Penny's response.
- Answer is hidden by default (parent taps to reveal if needed).
- Push for automaticity: if the parent wants to track response time, an optional "start/stop" micro-timer is available, but not required.
- Activity types (cycled across sessions):
  - Deletion: "Say 'brand.' Now say it without the /b/." (answer: "rand")
  - Substitution: "Say 'cat.' Change the /k/ to /b/." (answer: "bat")
  - Initial sound isolation: "What's the first sound in 'frog'?" (answer: /f/)
  - Final sound isolation: "What's the last sound in 'jump'?" (answer: /p/)
- Difficulty progresses: CVC deletion -> blend deletion -> substitution -> multi-step manipulation.
- 8-12 items per warmup. Target: complete in under 2 minutes.

### 5.6 Flashcard Review

**Screen layout:**

```
+------------------------------------------+
|  Quick Review                            |
|                                          |
|              clap                        |
|                                          |
|  [ CORRECT ]        [ INCORRECT ]        |
|                                          |
|  7 of 15         ||||||||.......          |
+------------------------------------------+
```

**Behavior:**
- One word at a time, large centered text.
- Penny reads the word aloud. Parent taps CORRECT or INCORRECT.
- Mix: 70-80% previously taught words (cumulative review), 20-30% current pattern words.
- Incorrect words re-appear later in the same review set (spaced repetition within session).
- Words consistently missed across sessions get flagged for extra practice.

### 5.7 Progress Tracking

**Data collected per session:**
- Date, time, duration, which parent ran it
- Per-activity: items attempted, items correct, accuracy %
- Fluency readings: passage ID, WCPM, accuracy %, error words
- Pattern progress: accuracy on words containing each pattern

**Progress views for parents:**

1. **WCPM Over Time Chart:** Line graph of all fluency readings. X-axis = date, Y-axis = WCPM. Include a goal line (target WCPM by end of school year). Include benchmark lines for 25th and 50th percentile norms.

2. **Skills Map:** Grid/checklist of all phonics patterns in the scope and sequence, color-coded: NOT_STARTED (gray), IN_PROGRESS (yellow), MASTERED (green). Quick visual of where Penny is in the sequence.

3. **Session History:** List of recent sessions with date, duration, lesson, and key metrics. Lets a parent see what the other parent did yesterday.

4. **Growth Rate:** Rolling 4-week WCPM growth rate calculated and displayed. Alert thresholds:
   - Green: >= 2.0 WCPM/week (excellent, gap is closing)
   - Yellow: 1.0-1.9 WCPM/week (maintaining but may not be closing the gap)
   - Red: < 1.0 WCPM/week (intervention adjustment needed)

### 5.8 Placement / Calibration Flow

**First-time use:**

1. App presents Phase 1 skills as a quick-check assessment. For each sub-skill (letter sounds, short vowels, digraphs, etc.), show 5-8 words. Parent marks correct/incorrect.
2. Skills at 90%+ accuracy are marked MASTERED and skipped.
3. Skills below 90% are queued as REINFORCE lessons.
4. After placement, the app determines the starting lesson in the scope and sequence.
5. Parent can also manually override: "Start at [lesson]" or "Mark [skill] as mastered."

**Ongoing calibration:**
- If Penny breezes through a lesson (95%+ on first attempt at everything), the app suggests advancing faster.
- If Penny struggles (below 80% accuracy), the app suggests stepping back or repeating.
- The parent always has manual control to adjust.

---

## 6. Content Specifications

### Word Lists

Each phonics pattern needs a word list of 20-40 words. Words should be:
- Common, concrete, within a 6-year-old's listening vocabulary
- Decodable using only patterns taught so far (no "reach" words that require untaught patterns)
- A mix of 1-syllable (primary) and 2-syllable (occasional, for suffixed forms)

**Source:** UFLI Foundations free toolbox word lists, organized by phonics pattern. Supplement with Fry/Dolch high-frequency words that match the current pattern.

### Word Chains

Each phonics pattern needs 3-5 word chains of 5-10 words each. Chains must:
- Change exactly one phoneme per step
- Use only patterns taught so far (plus the current pattern being introduced)
- Progress from easier changes (initial consonant swap) to harder (medial vowel swap)

### Decodable Passages

Each lesson or pair of lessons needs 1-2 decodable passages:
- 50-100 words for weekday passages, 80-120 words for weekend passages
- Use only phonics patterns taught up to and including the current lesson
- Simple, engaging narratives (not stilted "decodable reader" prose if possible)
- Include a title
- Tag each passage with the patterns it contains

**Content generation strategy for MVP:** Hand-write or AI-generate (then hand-review) the first 20-30 passages covering Phase 2 skills. Each passage must be verified to contain ONLY taught patterns -- no untaught vowel teams or irregular words sneaking in. High-frequency irregular words (the, said, was, is, of, to, you, are) are permitted as they are taught as "heart words" separately.

### Phonemic Awareness Prompts

Each warmup type needs a bank of 30-50 items at appropriate difficulty levels:
- Level 1 (CVC): deletion and substitution with simple CVC words
- Level 2 (blends): deletion and substitution with blend words
- Level 3 (advanced): multi-step manipulations

---

## 7. UI/UX Requirements

### Design Principles

- **Tablet-first.** Primary device is an iPad or Android tablet in landscape orientation. Must also work in portrait. Responsive for phone (parent checking progress) and laptop.
- **Child-facing screens are simple.** Minimal text, large fonts (28px+), high contrast, no clutter. The child should never need to read instructions -- the parent mediates.
- **Parent-facing elements are clearly separated.** Parent prompts ("Say to Penny: ...") are visually distinct from child-facing content. Consider a muted color or smaller font for parent instructions.
- **Touch-friendly.** All interactive elements: minimum 48x48px. Letter tiles: ideally 56-64px. No hover states (touch-only).
- **Drag and drop must work on mobile/tablet.** Use a library that handles touch drag well (e.g., dnd-kit for React, or custom touch event handling). Also support tap-to-place as an alternative to drag.
- **Session timer is non-intrusive.** Small, in the corner. The child should not feel "tested." The parent sees the timer; the child sees the words.
- **Celebrations are brief.** Correct answer: 0.5-1 second animation (confetti, checkmark, star). No long animations that waste session time.
- **No gamification that overshadows learning.** No coins, levels, avatars, or reward shops. Streaks and simple celebrations are fine. The "reward" is progress itself.

### Color and Typography

- Use a clean, warm color palette. Avoid primary-color overload.
- Body text for reading passages: serif or semi-serif font optimized for readability (e.g., Literata, Bookerly, or system serif). This is reading practice -- the font matters.
- UI elements: clean sans-serif (Inter, system font).
- High contrast: WCAG AA minimum for all text.

### Navigation

- Bottom tab bar (4 tabs): Today | Lessons | Progress | Settings
- **Today:** Daily dashboard with START SESSION button.
- **Lessons:** Full scope and sequence with progress status per lesson. Allows manual navigation.
- **Progress:** Charts and skill map.
- **Settings:** Manage parents, adjust schedule, manual calibration overrides.

---

## 8. Implementation Phases

### Phase 1: Foundation (Target: 1-2 weeks)

**Goal:** Core data model, basic UI shell, and the first working activity.

Tasks:
1. Initialize project: React + TypeScript + Tailwind. Set up routing (React Router).
2. Set up backend: API server with endpoints for sessions, progress, and content retrieval. Database schema per data model above.
3. Implement authentication: simple PIN entry screen.
4. Build the Daily Dashboard (home screen) with static/mock data.
5. Build the Word Building activity -- this is the most complex interactive component, so start here.
6. Create the first batch of content: word lists and word chains for Phase 2 skills 2.1 through 2.4 (two-letter blends).
7. Implement the placement/calibration flow for Phase 1 skills.

**Exit criteria:** A parent can log in, see today's session, and run a word-building activity with real content for two-letter blends. Data is persisted.

### Phase 2: MVP (Target: 2-3 weeks after Phase 1)

**Goal:** All four session activities working, session flow complete, basic progress tracking.

Tasks:
1. Build the Word Chain activity.
2. Build the Decodable Passage Reader with timer and parent-marked accuracy.
3. Build the Phonemic Awareness Warmup.
4. Build the Flashcard Review.
5. Implement the session flow controller: WARMUP -> REVIEW -> PRACTICE -> READ, with transitions and session completion logging.
6. Build the session history view (list of past sessions).
7. Build the WCPM-over-time chart.
8. Create content for Phase 2 skills 2.5 through 2.10 (CCVCC, three-letter blends, CVCe).
9. Write/curate the first 15-20 decodable passages covering skills 2.1 through 2.10.
10. Implement the daily schedule logic: determine today's lesson based on progress, day of week, and schedule rules.

**Exit criteria:** A parent can run a complete 10-15 minute session through all four activities. Session data is tracked. WCPM scores are plotted over time. The app knows what to present each day.

### Phase 3: Polish and Expand (Target: 2-3 weeks after Phase 2)

**Goal:** Full content through Phase 3, progress visualization, engagement features.

Tasks:
1. Build the Skills Map visualization.
2. Build the growth rate calculator with alert thresholds.
3. Add session streaks and brief celebration animations.
4. Create content for Phase 2 skills 2.11-2.13 (suffixes) and all Phase 3 skills.
5. Write/curate decodable passages for Phase 3 skills (10-15 more passages).
6. Add the "error words" feedback loop: words missed in passage reading auto-populate into future review sessions.
7. Add manual calibration controls in Settings.
8. Add parent notes field: free-text box for a parent to leave a note after a session ("She struggled with /ai/ today, revisit tomorrow").
9. Responsive design pass: test and fix on iPad, Android tablet, phone, and laptop.
10. Implement the mastery/regression logic: auto-advance when mastered, re-queue when accuracy drops.

**Exit criteria:** Full scope and sequence content is in the app. Progress tracking is complete and actionable. A non-technical parent can pick up the app and run a session without help.

### Post-MVP Features (Backlog, prioritized)

1. **Nonsense word practice** -- CVC and CCVC nonsense words to isolate true decoding.
2. **High-frequency word tracker** -- Dolch/Fry checklist with informal assessment.
3. **Spelling dictation mode** -- Parent says a word, Penny builds it (extends word building).
4. **Reader's Theater scripts** -- Simple scripts for family performance practice.
5. **Parent dashboard** -- Aggregated weekly/monthly view with suggested next steps.
6. **Reward/motivation system** -- Stickers, unlockable themes. Keep it lightweight.
7. **Data export** -- Export WCPM data as CSV to share with school or private evaluator.
8. **Echo reading mode** -- Passage displayed with sentence-level highlighting for echo reading protocol.

---

## 9. Content Generation Guidelines (for AI Agents)

When generating content (word lists, word chains, decodable passages, phonemic awareness prompts), follow these rules:

### Word Lists
- Only include words decodable with patterns taught at or before the target lesson.
- No irregular spellings (e.g., don't include "said" in a short-a word list).
- Prefer concrete nouns and common verbs a 6-year-old knows.
- Minimum 20 words per pattern, target 30-40.
- Tag each word with all patterns it contains.

### Word Chains
- Exactly one phoneme changes per step.
- All words in the chain must be real English words.
- All words must be decodable with taught patterns.
- Prefer chains where the change position varies (initial -> final -> medial).
- 5-10 words per chain.

### Decodable Passages
- CRITICAL: Every word must be decodable using ONLY patterns taught up to and including the current lesson, OR be a permitted high-frequency irregular word from this list: the, a, an, is, are, was, were, has, have, had, do, does, said, says, to, of, you, your, they, their, we, he, she, it, I, my, me, be, no, so, go, or, for, her, his, him, who, what, where, when, why, how, all, from, one, two, come, some, put, pull, push, full, could, would, should, there, here.
- 50-120 words per passage.
- Simple narrative structure: character + setting + small problem or action + resolution.
- Engaging but not distracting. The story serves the phonics practice.
- Avoid rhyming text (it can encourage guessing from rhyme patterns rather than decoding).
- Include the target pattern words naturally (3-8 instances of the target pattern per passage).
- Include a title.

### Phonemic Awareness Prompts
- Use only words Penny is likely to know aurally.
- Deletion items: "Say [word]. Now say it without the [sound]."
- Substitution items: "Say [word]. Change the [sound] to [sound]."
- All answers must be real English words (or at minimum, pronounceable).
- Clearly specify the target sound using phoneme notation (/b/, /s/, /ae/).

---

## 10. Decision Rules for the AI Agent

When building this app, apply these rules to resolve ambiguity:

1. **If unsure whether a feature is MVP or post-MVP:** It is post-MVP. Ship the core session flow first.
2. **If unsure about a phonics sequence decision:** Follow the order in Section 3. Do not rearrange.
3. **If unsure about visual design:** Simple, clean, large text, high contrast. When in doubt, make it bigger and simpler.
4. **If unsure about a word's decodability:** Check it against the taught patterns list. If it requires an untaught pattern, exclude it.
5. **If implementing drag-and-drop:** Always provide a tap-to-place fallback. Drag-and-drop is unreliable on mobile for small children.
6. **If a component is getting complex:** Split it. Separate parent-facing instruction UI from child-facing activity UI.
7. **If a passage or word list needs review:** Flag it with a `// TODO: VERIFY DECODABILITY` comment. Do not silently include unverified content.
8. **If in doubt about session timing:** Err short. A 10-minute session Penny completes is better than a 20-minute session she resists.
9. **If implementing celebrations/animations:** Keep them under 1 second. No sound effects in MVP.
10. **If the data model needs a field you don't see here:** Add it. Document it with a comment explaining why.

---

## 11. Files and Directory Structure

```
penny-reading-app/
  README.md
  package.json
  tsconfig.json
  tailwind.config.ts
  
  src/
    app/
      layout.tsx
      page.tsx              # Daily Dashboard
      
    components/
      activities/
        WordBuilding.tsx     # Letter tile word building activity
        WordChain.tsx        # Word chain / word ladder activity
        PassageReader.tsx    # Decodable passage reader with timer
        PhonemicWarmup.tsx   # Phonemic awareness oral activity
        FlashcardReview.tsx  # Quick word review flashcards
      
      session/
        SessionFlow.tsx      # Orchestrates WARMUP -> REVIEW -> PRACTICE -> READ
        SessionComplete.tsx  # End-of-session summary
        
      progress/
        WcpmChart.tsx        # WCPM over time line chart
        SkillsMap.tsx        # Pattern mastery grid
        GrowthRate.tsx       # Rolling growth rate with alerts
        SessionHistory.tsx   # List of past sessions
        
      placement/
        PlacementFlow.tsx    # First-time calibration
        
      ui/
        LetterTile.tsx       # Reusable draggable/tappable letter tile
        Timer.tsx            # Reading timer component
        ProgressBar.tsx      # Session progress indicator
        CelebrationAnim.tsx  # Brief correct-answer animation
        ParentPrompt.tsx     # Styled container for parent-facing instructions
        
    lib/
      content/
        scope-sequence.ts    # Full phonics scope and sequence definition
        word-lists.ts        # Word lists organized by pattern ID
        word-chains.ts       # Word chain sequences by pattern ID
        passages.ts          # Decodable passages with metadata
        warmup-prompts.ts    # Phonemic awareness prompt banks
        heart-words.ts       # Permitted irregular high-frequency words
        
      engine/
        session-planner.ts   # Determines today's lesson, builds session plan
        mastery-tracker.ts   # Evaluates mastery criteria, handles regression
        review-selector.ts   # Selects cumulative review words (70-80% review, 20-30% new)
        growth-calculator.ts # Calculates rolling WCPM growth rate
        
      api/
        client.ts            # API client for backend communication
        types.ts             # Shared TypeScript types matching data model
        
  server/
    index.ts                 # API server entry point
    routes/
      auth.ts
      sessions.ts
      progress.ts
      content.ts
    db/
      schema.sql             # Database schema
      seed.ts                # Seed script for initial content
      
  content/
    raw/
      word-lists/            # Source word list files per pattern
      passages/              # Source passage files
      chains/                # Source word chain files
      warmups/               # Source phonemic awareness prompts
    scripts/
      validate-decodability.ts  # Script to verify all words in passages are decodable
      import-content.ts         # Script to import raw content into database
```

---

## 12. Testing Strategy

### Content Validation (Highest Priority)
- `validate-decodability.ts`: For every passage, verify that every word is either (a) decodable using only patterns taught at or before the passage's `max_pattern_id`, or (b) on the permitted heart-words list. This script should run as a CI check. A single untaught word in a passage will undermine the child's confidence.

### Activity Logic
- Unit tests for `session-planner.ts`: Given a set of completed lessons and today's date/day-of-week, does it produce the correct session plan?
- Unit tests for `mastery-tracker.ts`: Given accuracy history, does it correctly flag mastery and regression?
- Unit tests for `review-selector.ts`: Does the word selection maintain the 70-80% review / 20-30% new ratio?
- Unit tests for `growth-calculator.ts`: Given a series of WCPM scores with dates, does it produce the correct weekly growth rate?

### UI/Interaction
- Manual testing on iPad (primary device) for all touch interactions.
- Verify drag-and-drop AND tap-to-place both work for word building and word chains.
- Verify timer accuracy in passage reader.
- Verify WCPM calculation: (words read correctly) / (time in minutes).

---

## 13. Key Metrics and Success Criteria

The app is working if:
1. **Penny uses it 5 days/week consistently.** Engagement is the prerequisite for everything.
2. **WCPM grows at >= 1.5 words/week** over a rolling 4-week window.
3. **Accuracy on practiced patterns reaches 90%+** within 3-4 sessions per pattern.
4. **Both parents can run sessions independently** without confusion about what to do.
5. **Sessions complete in 10-15 minutes on weekdays** without frustration or meltdowns.

The app needs adjustment if:
- WCPM growth is < 1.0 words/week for 4+ consecutive weeks.
- Penny resists or avoids sessions consistently.
- Accuracy on a pattern plateaus below 80% after 4+ sessions.
- Parents disagree about what to do or where Penny is in the sequence.

---

## Appendix A: Research-Based Dosage Parameters

These numbers come from the evidence synthesis and should inform all timing and scheduling decisions:

| Parameter | Value | Source |
|---|---|---|
| Optimal session length (1-on-1, age 6) | 15-20 min | Pullen et al.; attention span research |
| Minimum weekly frequency for effect | 3 days/week | Nickow et al. 2024 NBER meta-analysis |
| Optimal weekly frequency | 4-5 days/week | Minnesota Reading Corps; distributed practice research |
| Ratio of review to new instruction | 70-80% review : 20-30% new | CORE Learning; cumulative review research |
| Readings per passage before diminishing returns | 3-4 | Therrien 2004 meta-analysis |
| Target accuracy for passage reading | 95%+ | Instructional level research |
| Mastery criterion for pattern advancement | 90%+ across 3 sessions | Standard mastery learning criteria |
| Expected gap-closing growth rate | >= 1.5 WCPM/week | Hasbrouck & Tindal norms; Tier 3 goal rates |
| Total intervention hours to close gap | 30-60 hours | Torgesen et al.; IDA estimates |
| End-of-1st-grade 50th percentile WCPM | 60 | Hasbrouck & Tindal 2017 |
| End-of-1st-grade 25th percentile WCPM | 34 | Hasbrouck & Tindal 2017 |

## Appendix B: Permitted Heart Words

These high-frequency irregular words may appear in any decodable passage regardless of the phonics patterns taught. They are taught separately as "heart words" (words you learn "by heart" because parts of them don't follow the rules):

```
the, a, an, is, are, was, were, has, have, had, do, does, said, says,
to, of, you, your, they, their, we, he, she, it, I, my, me, be,
no, so, go, or, for, her, his, him, who, what, where, when, why, how,
all, from, one, two, come, some, put, pull, push, full,
could, would, should, there, here
```

## Appendix C: Parent Script Template

Every INTRODUCE lesson should include a parent script. Template:

```
PATTERN: [pattern name, e.g., "Two-letter blends: cl, bl"]

SAY TO PENNY:
"Today we're going to learn about words that start with two sounds
blended together. Listen: /k/ /l/ -- 'cl'. When we see C and L together
at the start of a word, we blend them: /kl/. Let's try some words."

MODEL:
Write or show the word "clap."
"Watch me sound this out: /kl/ - /a/ - /p/. Clap. Now you try."

GUIDED PRACTICE:
Show words one at a time: clip, club, clam, class.
"Sound it out. What's the blend? What's the rest of the word? Put it together."

CORRECT RESPONSE: "Yes! You blended those sounds perfectly."
ERROR CORRECTION: "Let's look again. What two letters do you see at the start?
What sound do they make together? Now blend it with the rest."
```
