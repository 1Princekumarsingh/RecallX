# Quiz Continue Resume Bugfix Design

## Overview

This bugfix addresses a critical issue where the "Continue Quiz" functionality fails to resume quizzes from their saved positions. The bug manifests in two distinct locations:

1. **Dashboard Navigation Bug**: The "Continue Chapter" button on the Dashboard navigates to `/quiz/${chapter_id}` without the required `session_key` parameter, causing the quiz to start fresh instead of resuming saved progress.

2. **State Restoration Bug**: The `useQuizState` hook receives saved state through the `initialState` parameter but fails to properly restore all fields. The `normalizeState` function performs structural validation but doesn't preserve critical saved values like `current_question_index`, quiz mode, timer configuration, answers, and bookmarks.

The fix will ensure users can seamlessly resume their quiz sessions from the exact question they left off, with all their progress intact including selected answers, bookmarks, quiz mode, and timer configuration.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a user attempts to continue a saved quiz session
- **Property (P)**: The desired behavior when resuming - the quiz should restore to the exact saved state
- **Preservation**: Existing behavior for starting new quizzes and saving progress that must remain unchanged
- **session_key**: A unique identifier for a quiz session, constructed from chapter_id, mode, timer settings, batch size, and question range
- **QuizProgress**: Backend database record that stores the complete state of a quiz session for later resumption
- **QuizProgressState**: The serialized state object containing all quiz data (questions, answers, current index, config, etc.)
- **useQuizState**: React hook in `frontend/src/hooks/useQuizState.ts` that manages quiz state and actions
- **normalizeState**: Function in `useQuizState` that validates state structure but currently fails to preserve saved values
- **Dashboard**: Component in `frontend/src/pages/Dashboard.tsx` that displays the "Continue Chapter" button
- **statisticsApi.getDashboard**: API endpoint that returns dashboard statistics including `last_chapter_id`

## Bug Details

### Bug Condition

The bug manifests when a user attempts to resume a saved quiz session through either the Dashboard "Continue Chapter" button or the Chapter card "Continue from Q{X}" button. The system fails to properly restore the saved quiz state, causing users to restart from Question 1 instead of their saved position.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type UserAction (click on Continue button)
  OUTPUT: boolean
  
  RETURN (input.action == "click" AND input.target == "Continue Chapter" on Dashboard)
         OR (input.action == "click" AND input.target == "Continue from Q{X}" on Chapter card)
         AND existsIncompleteSavedProgress(input.chapter_id, input.user_id)
         AND (
           NOT session_key_parameter_included(input.navigation) 
           OR NOT quiz_state_properly_restored(input.session_key)
         )
END FUNCTION
```

### Examples

**Dashboard Navigation Bug:**
- User has saved progress on Chapter 5 at Question 15 in practice mode
- User clicks "Continue Chapter" button on Dashboard
- **Actual behavior**: Navigates to `/quiz/5` without `session_key` parameter
- **Result**: Quiz starts from Question 1 in exam mode (default), ignoring saved progress

**State Restoration Bug (Chapter Card):**
- User has saved progress: Question 8, practice mode, 3 answers selected, 2 bookmarks
- User clicks "Continue from Q9" on Chapter card
- System navigates to `/quiz/5?session_key=5-practice-unlimited---` with correct session_key
- **Actual behavior**: Quiz loads but shows Question 1 instead of Question 8
- **Result**: User must manually navigate to Question 8, all answers and bookmarks are lost

**Combined Effect:**
- User saves quiz at Question 12 with timer enabled (30 min remaining)
- User returns later and clicks "Continue Chapter"
- **Actual behavior**: Quiz starts from Question 1 in exam mode with fresh timer
- **Result**: Complete loss of progress, timer resets, mode changes, answers lost

**Edge Case - Completed Quiz:**
- User completes a quiz (is_completed = true)
- User clicks "Continue Chapter" on a different in-progress quiz
- **Expected behavior**: Should show the in-progress quiz, not the completed one

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Starting a new quiz (without `session_key`) must continue to initialize from Question 1 with user-selected configuration
- Quiz progress saving to the backend must continue to work correctly with all state fields
- Chapter card "Continue from Q{X}" navigation with `session_key` parameter must continue to include the parameter
- "Save & Exit" functionality must continue to persist current quiz state
- Mouse clicks, keyboard inputs, and UI interactions in quiz must continue to work identically
- Quiz mode enforcement (practice vs exam rules) must continue to function correctly
- Timer functionality must continue to track time and enforce limits correctly
- Question navigation (Next/Previous) must continue to work in both new and resumed sessions

**Scope:**
All inputs that do NOT involve clicking "Continue Chapter" or "Continue from Q{X}" buttons should be completely unaffected by this fix. This includes:
- Starting new quizzes with custom configuration
- Completing quizzes and viewing results
- Saving and loading quiz progress through existing mechanisms
- All quiz interaction features (answering, bookmarking, navigating)

## Hypothesized Root Cause

Based on the bug description and code analysis, the root causes are:

1. **Dashboard Data Source Mismatch**: The Dashboard uses `statisticsApi.getDashboard()` which queries the `last_chapter_id` from the most recent `QuizAttempt` record (completed quizzes). It should instead query the most recent **incomplete** `QuizProgress` record to find in-progress sessions. Additionally, the statistics endpoint doesn't return the `session_key`, so the Dashboard cannot construct the proper navigation URL.

2. **Incomplete State Restoration in useQuizState**: The `useQuizState` hook receives `restoredQuizState` through the `initialState` parameter. The initialization uses `normalizeState(initialState, initialConfig, questions)` which is designed for structural validation, not full state restoration. The function:
   - Takes `state.current_question_index` but clamps it without preserving the exact saved value
   - Uses `state.config ?? config` which may override saved configuration
   - Doesn't restore the `answers` Map from the saved state
   - Doesn't restore timer state (`start_time`, `elapsed_time`)
   - Doesn't restore `is_paused` or `is_completed` flags

3. **deserializeQuizState Implementation**: The `deserializeQuizState` function (used to convert backend JSON to frontend state) may not properly reconstruct the `answers` Map or may lose data during conversion.

4. **State Initialization Logic**: The useState initialization uses a ternary `initialState ? normalizeState(...) : createFreshState(...)` which suggests that even when `initialState` exists, the normalization process discards the actual saved values.

## Correctness Properties

Property 1: Bug Condition - Resume Quiz at Saved Position

_For any_ user action where the "Continue Chapter" button is clicked on the Dashboard OR the "Continue from Q{X}" button is clicked on a Chapter card, AND an incomplete saved quiz session exists for that chapter and user, the fixed system SHALL navigate to the quiz page with the correct `session_key` parameter AND restore the complete quiz state including current_question_index, mode, timer configuration, all selected answers, all bookmarks, visited questions, batch size, question range, start_time, and elapsed_time, resulting in the quiz displaying the exact question where the user left off with all their progress intact.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9**

Property 2: Preservation - New Quiz Initialization

_For any_ user action that starts a new quiz session without a `session_key` parameter (explicit new quiz start), the fixed system SHALL produce exactly the same behavior as the original system, initializing from Question 1 with the user-selected configuration (mode, timer, batch size, question range) and creating a fresh answers Map with all questions marked as unvisited and unanswered, preserving the original new quiz experience.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File 1**: `backend/app/api/statistics.py`

**Function**: `get_dashboard`

**Specific Changes**:
1. **Add QuizProgress Query**: After querying the last `QuizAttempt`, also query the most recent **incomplete** `QuizProgress` record for the current user:
   ```python
   last_progress = db.query(QuizProgress).filter(
       QuizProgress.user_id == current_user.id,
       QuizProgress.is_completed == False
   ).order_by(QuizProgress.updated_at.desc()).first()
   ```

2. **Prioritize In-Progress Quiz**: If `last_progress` exists and its `updated_at` is more recent than `last_attempt.quiz_date`, use the chapter from `last_progress` instead:
   ```python
   if last_progress and (not last_attempt or last_progress.updated_at > last_attempt.quiz_date):
       last_chapter_id = last_progress.chapter_id
       last_session_key = last_progress.session_key
   ```

3. **Update Response Schema**: Add `last_session_key` field to the `DashboardStats` response schema in `backend/app/schemas/statistics.py`

4. **Return Session Key**: Include the `last_session_key` in the return statement:
   ```python
   return {
       ...existing fields...,
       "last_chapter_id": last_chapter_id,
       "last_session_key": last_session_key,
       "last_chapter_name": last_chapter_name
   }
   ```

**File 2**: `frontend/src/api/statistics.ts`

**Interface**: `DashboardStats`

**Specific Changes**:
1. **Add Session Key Field**: Add `last_session_key` to the `DashboardStats` interface:
   ```typescript
   export interface DashboardStats {
     overall_accuracy: number
     total_questions: number
     completed_questions: number
     review_questions: number
     errors: number
     last_chapter_id?: number
     last_subject_id?: number
     last_chapter_name?: string
     last_session_key?: string  // NEW FIELD
   }
   ```

**File 3**: `frontend/src/pages/Dashboard.tsx`

**Component**: `Dashboard`

**Specific Changes**:
1. **Update Navigation URL**: Change the "Continue Chapter" button's `to` prop to include the `session_key` parameter when available:
   ```typescript
   <Link
     to={stats.last_session_key 
       ? `/quiz/${stats.last_chapter_id}?session_key=${encodeURIComponent(stats.last_session_key)}`
       : `/quiz/${stats.last_chapter_id}`
     }
     className="..."
   >
     Continue Chapter
   </Link>
   ```

**File 4**: `frontend/src/hooks/useQuizState.ts`

**Function**: `normalizeState` and `useState` initialization

**Specific Changes**:
1. **Fix normalizeState Function**: Update `normalizeState` to preserve all saved state values instead of just validating structure:
   ```typescript
   function normalizeState(state: QuizState, config: QuizConfig, questions: QuizQuestion[]): QuizState {
     // Use saved questions if available, otherwise use fresh questions
     const normalizedQuestions = state.questions?.length ? state.questions : questions
     
     // Preserve the saved current_question_index (already bounded correctly)
     const maxIndex = Math.max(normalizedQuestions.length - 1, 0)
     const currentIndex = Number.isFinite(state.current_question_index)
       ? Math.min(Math.max(state.current_question_index, 0), maxIndex)
       : 0
   
     // Preserve ALL state fields from saved state
     return {
       ...state,  // Spread ALL saved state first
       config: state.config,  // Use saved config, not the default
       questions: normalizedQuestions,
       current_question_index: currentIndex,
       // Explicitly preserve these critical fields
       answers: state.answers,  // Keep saved answers Map
       start_time: state.start_time,  // Keep saved start time
       elapsed_time: state.elapsed_time,  // Keep saved elapsed time
       is_paused: state.is_paused,  // Keep saved pause state
       is_completed: state.is_completed  // Keep saved completion state
     }
   }
   ```

2. **Verify deserializeQuizState**: Ensure `deserializeQuizState` in `frontend/src/lib/quizProgress.ts` properly reconstructs the `answers` Map from the serialized state:
   ```typescript
   // Ensure answers are converted from Record<number, QuizAnswer> to Map
   const answersMap = new Map<number, QuizAnswer>(
     Object.entries(state.answers).map(([key, value]) => [Number(key), value])
   )
   
   return {
     ...state,
     answers: answersMap
   }
   ```

**File 5**: `frontend/src/lib/quizProgress.ts`

**Function**: `deserializeQuizState`

**Specific Changes**:
1. **Ensure Proper Map Reconstruction**: Verify that the serialized answers (stored as `Record<number, QuizAnswer>` in backend) are properly converted to a `Map<number, QuizAnswer>`:
   ```typescript
   export function deserializeQuizState(state: QuizProgressState): QuizState {
     // Convert answers from Record to Map
     const answersMap = new Map<number, QuizAnswer>()
     Object.entries(state.answers).forEach(([key, value]) => {
       answersMap.set(Number(key), value)
     })
   
     return {
       config: state.config,
       questions: state.questions,
       answers: answersMap,  // Use the reconstructed Map
       current_question_index: state.current_question_index,
       start_time: state.start_time,
       elapsed_time: state.elapsed_time,
       is_paused: state.is_paused,
       is_completed: state.is_completed
     }
   }
   ```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate user interactions with the "Continue Chapter" and "Continue from Q{X}" buttons on code with the bugs still present. Verify that the navigation is missing `session_key` (Dashboard) and that state is not restored (useQuizState). Run these tests on the UNFIXED code to observe failures and confirm our understanding of the bug.

**Test Cases**:
1. **Dashboard Missing Session Key Test**: 
   - Save progress on Chapter 3 at Question 10
   - Render Dashboard component
   - Click "Continue Chapter" button
   - Assert navigation URL is `/quiz/3` (missing session_key)
   - **Expected on unfixed code**: Test passes - URL is indeed missing session_key

2. **State Not Restored Test**:
   - Create saved state with: current_question_index = 7, mode = 'practice', 2 answers, 1 bookmark
   - Initialize useQuizState with saved state
   - Assert current_question_index equals 7
   - Assert mode equals 'practice'
   - Assert answers Map contains 2 entries
   - **Expected on unfixed code**: Test fails - current_question_index is 0, answers Map is empty

3. **Dashboard Using Wrong Data Source**:
   - Create a completed QuizAttempt for Chapter 1 (quiz_date = yesterday)
   - Create an incomplete QuizProgress for Chapter 2 (updated_at = today)
   - Call getDashboard API
   - Assert last_chapter_id equals 2 (the in-progress quiz)
   - **Expected on unfixed code**: Test fails - last_chapter_id is 1 (completed quiz)

4. **Config Not Restored Test**:
   - Create saved state with: mode = 'exam', timer_mode = 'whole_test', timer_value = 1800
   - Initialize useQuizState with saved state
   - Assert config.mode equals 'exam'
   - Assert config.timer_mode equals 'whole_test'
   - **Expected on unfixed code**: Test fails - config uses default values from initialConfig parameter

**Expected Counterexamples**:
- Dashboard navigates without session_key parameter
- useQuizState initializes with current_question_index = 0 despite saved state having index = 7
- Answers Map is empty despite saved state containing answers
- Config uses default values instead of saved configuration
- Dashboard returns last completed quiz instead of last in-progress quiz

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := handleContinueAction_fixed(input)
  ASSERT quiz_resumes_at_saved_position(result)
  ASSERT all_saved_state_restored(result)
  ASSERT session_key_parameter_present(result)
END FOR
```

**Test Implementation**:
```typescript
// Test 1: Dashboard includes session_key
test('Dashboard Continue Chapter includes session_key', () => {
  // Setup: Mock getDashboard to return last_session_key
  const mockStats = {
    last_chapter_id: 5,
    last_session_key: '5-practice-unlimited---',
    last_chapter_name: 'Test Chapter'
  }
  
  render(<Dashboard />)
  
  const continueButton = screen.getByText('Continue Chapter')
  expect(continueButton).toHaveAttribute('href', '/quiz/5?session_key=5-practice-unlimited---')
})

// Test 2: useQuizState restores current_question_index
test('useQuizState restores saved question index', () => {
  const savedState = {
    current_question_index: 12,
    config: { mode: 'practice', ... },
    questions: [...],
    answers: new Map([[1, { selected_answer: 'A', ... }]]),
    ...
  }
  
  const { result } = renderHook(() => useQuizState(config, questions, savedState))
  
  expect(result.current.state.current_question_index).toBe(12)
})

// Test 3: useQuizState restores all answers
test('useQuizState restores all saved answers', () => {
  const savedAnswers = new Map([
    [1, { question_id: 1, selected_answer: 'B', is_bookmarked: true, ... }],
    [5, { question_id: 5, selected_answer: 'C', is_bookmarked: false, ... }]
  ])
  
  const savedState = { answers: savedAnswers, ... }
  
  const { result } = renderHook(() => useQuizState(config, questions, savedState))
  
  expect(result.current.state.answers.size).toBe(2)
  expect(result.current.state.answers.get(1)?.selected_answer).toBe('B')
  expect(result.current.state.answers.get(1)?.is_bookmarked).toBe(true)
})

// Test 4: useQuizState restores config
test('useQuizState restores saved config', () => {
  const savedConfig = {
    mode: 'exam',
    timer_mode: 'per_question',
    timer_value: 120,
    ...
  }
  
  const savedState = { config: savedConfig, ... }
  
  const { result } = renderHook(() => useQuizState(defaultConfig, questions, savedState))
  
  expect(result.current.state.config.mode).toBe('exam')
  expect(result.current.state.config.timer_mode).toBe('per_question')
  expect(result.current.state.config.timer_value).toBe(120)
})
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT handleNewQuizStart_original(input) = handleNewQuizStart_fixed(input)
  ASSERT handleQuizInteraction_original(input) = handleQuizInteraction_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for new quiz starts and quiz interactions, then write property-based tests capturing that behavior. Verify the fixed code produces identical results.

**Test Cases**:
1. **New Quiz Initialization Preservation**: Observe that starting a new quiz (without session_key) initializes from Question 1 with user config on unfixed code, then write test to verify this continues after fix
   ```typescript
   test('New quiz starts from Question 1', () => {
     const config = { mode: 'practice', timer_mode: 'unlimited', ... }
     const { result } = renderHook(() => useQuizState(config, questions))
     
     expect(result.current.state.current_question_index).toBe(0)
     expect(result.current.state.answers.size).toBe(questions.length)
     Array.from(result.current.state.answers.values()).forEach(answer => {
       expect(answer.selected_answer).toBeNull()
       expect(answer.is_visited).toBe(false)
     })
   })
   ```

2. **Quiz Interaction Preservation**: Observe that selecting answers, bookmarking, and navigation work correctly on unfixed code, then write tests to verify this continues after fix
   ```typescript
   test('Answer selection works in resumed quiz', () => {
     const savedState = { current_question_index: 5, ... }
     const { result } = renderHook(() => useQuizState(config, questions, savedState))
     
     act(() => {
       result.current.actions.selectAnswer(questions[5].id, 'A')
     })
     
     expect(result.current.state.answers.get(questions[5].id)?.selected_answer).toBe('A')
   })
   ```

3. **Progress Saving Preservation**: Observe that saving progress to backend continues to work correctly after fix
   ```typescript
   test('Progress saving includes all state fields', async () => {
     // Start quiz, answer questions, bookmark, navigate
     // Verify saved state includes all fields
   })
   ```

### Unit Tests

- Test Dashboard navigation URL construction with and without session_key
- Test useQuizState initialization with saved state vs fresh state
- Test normalizeState function preserves all saved fields
- Test deserializeQuizState properly converts Record to Map
- Test backend getDashboard returns most recent in-progress quiz
- Test backend getDashboard includes session_key in response
- Test edge cases: empty saved state, invalid current_question_index, missing fields

### Property-Based Tests

- Generate random saved states with various current_question_index values, verify all restore correctly
- Generate random quiz configurations, verify new quizzes initialize identically to original behavior
- Generate random answer patterns, verify saved answers restore completely
- Generate random bookmark patterns, verify bookmarks restore correctly
- Test boundary conditions: first question, last question, middle questions

### Integration Tests

- Test full user flow: Start quiz → Answer questions → Save & Exit → Resume from Dashboard → Continue from saved position
- Test full user flow: Start quiz → Answer questions → Save & Exit → Resume from Chapter card → All state restored
- Test switching between multiple in-progress quizzes on different chapters
- Test edge case: Resume completed quiz (should start new quiz)
- Test edge case: Resume quiz with no saved progress (should start from beginning with config)
- Test timer restoration: Save quiz with 15 minutes remaining → Resume → Timer continues from 15 minutes
