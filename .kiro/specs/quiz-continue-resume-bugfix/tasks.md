# Implementation Plan

- [ ] 1. Write bug condition exploration tests
  - **Property 1: Bug Condition** - Quiz Resume Fails to Restore Saved State
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate both bugs exist (Dashboard missing session_key + useQuizState not restoring state)
  - **Scoped PBT Approach**: Test concrete failing scenarios - Dashboard navigation without session_key, and state restoration with specific saved values
  
  - [ ] 1.1 Write Dashboard missing session_key exploration test
    - Test that Dashboard "Continue Chapter" button navigates WITHOUT session_key parameter on unfixed code
    - Setup: Create incomplete QuizProgress record with session_key = '5-practice-unlimited---' for Chapter 5 at Question 10
    - Setup: Mock statisticsApi.getDashboard to return last_chapter_id = 5
    - Render Dashboard component and click "Continue Chapter" button
    - Assert navigation URL is `/quiz/5` (missing session_key parameter)
    - **EXPECTED OUTCOME on unfixed code**: Test FAILS - confirms Dashboard bug exists (missing session_key)
    - Document counterexample: "Dashboard navigates to /quiz/5 instead of /quiz/5?session_key=5-practice-unlimited---"
    - _Requirements: 1.1, 2.1_

  - [ ] 1.2 Write useQuizState not restoring current_question_index exploration test
    - Test that useQuizState initializes with current_question_index = 0 despite saved state having different index
    - Create saved state with: current_question_index = 12, mode = 'practice', questions array
    - Initialize useQuizState hook with saved state
    - Assert result.current.state.current_question_index equals 12
    - **EXPECTED OUTCOME on unfixed code**: Test FAILS - current_question_index is 0, not 12
    - Document counterexample: "useQuizState initialized with index 0 instead of saved index 12"
    - _Requirements: 1.3, 1.8, 2.3, 2.8_

  - [ ] 1.3 Write useQuizState not restoring answers exploration test
    - Test that useQuizState fails to restore saved answers Map
    - Create saved state with: answers Map containing 3 entries with selected_answer values
    - Initialize useQuizState hook with saved state
    - Assert answers Map size equals 3
    - Assert answers contain the saved selected_answer values
    - **EXPECTED OUTCOME on unfixed code**: Test FAILS - answers Map is empty or doesn't match saved state
    - Document counterexample: "useQuizState initialized with empty answers instead of 3 saved answers"
    - _Requirements: 1.6, 2.6_

  - [ ] 1.4 Write useQuizState not restoring config exploration test
    - Test that useQuizState fails to restore saved quiz configuration
    - Create saved state with: config = { mode: 'exam', timer_mode: 'per_question', timer_value: 120 }
    - Initialize useQuizState hook with saved state and different default config
    - Assert state.config.mode equals 'exam'
    - Assert state.config.timer_mode equals 'per_question'
    - Assert state.config.timer_value equals 120
    - **EXPECTED OUTCOME on unfixed code**: Test FAILS - config uses default values instead of saved config
    - Document counterexample: "useQuizState initialized with default config instead of saved exam mode config"
    - _Requirements: 1.4, 1.5, 1.7, 2.4, 2.5, 2.7_

  - [ ] 1.5 Write Dashboard using wrong data source exploration test
    - Test that Dashboard returns completed quiz instead of in-progress quiz
    - Create completed QuizAttempt for Chapter 1 (quiz_date = yesterday)
    - Create incomplete QuizProgress for Chapter 2 (updated_at = today, session_key = '2-exam-unlimited---')
    - Call backend getDashboard API endpoint
    - Assert response.last_chapter_id equals 2 (the in-progress quiz)
    - Assert response.last_session_key equals '2-exam-unlimited---'
    - **EXPECTED OUTCOME on unfixed code**: Test FAILS - last_chapter_id is 1 (completed quiz), no session_key
    - Document counterexample: "getDashboard returned completed Chapter 1 instead of in-progress Chapter 2"
    - _Requirements: 1.1, 2.1_

  - [ ] 1.6 Write useQuizState not restoring bookmarks exploration test
    - Test that useQuizState fails to restore bookmark state
    - Create saved state with: answers Map where questions 3 and 7 have is_bookmarked = true
    - Initialize useQuizState hook with saved state
    - Assert answers.get(3).is_bookmarked equals true
    - Assert answers.get(7).is_bookmarked equals true
    - **EXPECTED OUTCOME on unfixed code**: Test FAILS - bookmarks not restored
    - Document counterexample: "useQuizState lost bookmark state for questions 3 and 7"
    - _Requirements: 1.6, 2.6_

  - [ ] 1.7 Write useQuizState not restoring timer state exploration test
    - Test that useQuizState fails to restore timer state
    - Create saved state with: start_time = '2024-01-15T10:30:00Z', elapsed_time = 900 (15 minutes)
    - Initialize useQuizState hook with saved state
    - Assert state.start_time equals saved start_time
    - Assert state.elapsed_time equals 900
    - **EXPECTED OUTCOME on unfixed code**: Test FAILS - timer state not restored
    - Document counterexample: "useQuizState initialized with fresh timer instead of saved elapsed_time"
    - _Requirements: 1.6, 2.6_

  - [ ] 1.8 Run all exploration tests on unfixed code and document results
    - Run all exploration tests from tasks 1.1-1.7
    - **EXPECTED OUTCOME**: All tests FAIL (this is correct - proves the bugs exist)
    - Document all counterexamples found in test output
    - Create summary of failure patterns to guide implementation
    - Mark task complete when all tests are written, run, and failures are documented
    - _Requirements: All Bug Analysis requirements (1.1-1.9)_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - New Quiz and Quiz Interaction Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (new quiz starts, quiz interactions)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code

  - [ ] 2.1 Observe and test new quiz initialization behavior
    - **Observation Step**: Start a new quiz WITHOUT session_key parameter on unfixed code
    - Observe: Quiz starts from Question 1 (current_question_index = 0)
    - Observe: Answers Map is initialized with all questions marked as unvisited and unanswered
    - Observe: Config uses user-selected values (mode, timer, batch size, range)
    - Write property-based test: For all new quiz starts (no session_key), current_question_index = 0
    - Write test: For all new quiz starts, answers Map has size = questions.length with all null selected_answer values
    - Write test: For all new quiz starts with custom config, config matches user selection
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.1, 3.2_

  - [ ] 2.2 Observe and test quiz interaction behavior (answer selection)
    - **Observation Step**: Start quiz, select answers, on unfixed code
    - Observe: selectAnswer action updates answers Map correctly
    - Observe: Selected answer persists in state
    - Write property-based test: For all question IDs and answer choices, selectAnswer updates the answers Map entry
    - Generate random answer patterns (multiple questions, various choices)
    - Verify selected_answer field matches input for all generated cases
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.6_

  - [ ] 2.3 Observe and test bookmark behavior
    - **Observation Step**: Bookmark questions on unfixed code
    - Observe: toggleBookmark action sets is_bookmarked flag correctly
    - Write property-based test: For all question IDs, toggleBookmark toggles is_bookmarked state
    - Generate random bookmark patterns (multiple questions, various toggle sequences)
    - Verify bookmark state matches expected toggle results
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.11_

  - [ ] 2.4 Observe and test navigation behavior (Next/Previous)
    - **Observation Step**: Navigate through quiz using Next/Previous buttons on unfixed code
    - Observe: goToNextQuestion increments current_question_index
    - Observe: goToPreviousQuestion decrements current_question_index
    - Observe: Boundary conditions (first/last question) are handled correctly
    - Write property-based test: For all valid question indices, goToNextQuestion moves to next index
    - Write property-based test: For all valid question indices > 0, goToPreviousQuestion moves to previous index
    - Write test: At last question, goToNextQuestion doesn't exceed bounds
    - Write test: At first question, goToPreviousQuestion stays at index 0
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.13_

  - [ ] 2.5 Observe and test Save & Exit behavior
    - **Observation Step**: Use "Save & Exit" functionality on unfixed code
    - Observe: Current state is persisted to backend
    - Observe: State includes all fields (current_question_index, answers, config, timer, etc.)
    - Write test: After Save & Exit, backend QuizProgress record contains all state fields
    - Write test: After Save & Exit, is_completed = false for in-progress quiz
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.3, 3.4, 3.5, 3.7_

  - [ ] 2.6 Observe and test quiz mode enforcement (practice vs exam)
    - **Observation Step**: Test practice mode and exam mode behavior on unfixed code
    - Observe Practice Mode: Immediate feedback shown, answers can be changed
    - Observe Exam Mode: No feedback until completion, answers locked after selection
    - Write test: In practice mode, feedback is displayed after answer selection
    - Write test: In exam mode, feedback is not displayed during quiz
    - Write test: Mode-specific rules are enforced correctly
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.9, 3.10_

  - [ ] 2.7 Observe and test timer functionality
    - **Observation Step**: Test timer behavior on unfixed code
    - Observe: Timer tracks elapsed time correctly
    - Observe: Timer enforces limits when configured
    - Write test: Timer increments elapsed_time during quiz
    - Write test: Timer respects timer_mode (unlimited, per_question, whole_test)
    - Write test: Timer enforces limits and triggers completion when time expires
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.12_

  - [ ] 2.8 Observe and test Chapter card display
    - **Observation Step**: View Chapter card with saved progress on unfixed code
    - Observe: "Continue from Q{X}" text shows correct question number based on saved progress
    - Write test: Chapter card displays correct question number from QuizProgress.current_question_index
    - Write test: Chapter card shows "Start Quiz" for chapters without saved progress
    - Verify tests pass on UNFIXED code
    - _Requirements: 3.8_

  - [ ] 2.9 Run all preservation tests on unfixed code
    - Run all preservation tests from tasks 2.1-2.8
    - **EXPECTED OUTCOME**: All tests PASS (confirms baseline behavior to preserve)
    - Document any test failures (would indicate test issues, not code issues)
    - Mark task complete when all tests pass on unfixed code
    - _Requirements: All Preservation Requirements (3.1-3.13)_

- [ ] 3. Fix for Quiz Continue Resume Bugs

  - [ ] 3.1 Fix Backend: Update getDashboard to prioritize in-progress quiz and return session_key
    - File: `backend/app/api/statistics.py`
    - Function: `get_dashboard`
    - Add QuizProgress query to find most recent incomplete quiz session
    - Query: `db.query(QuizProgress).filter(QuizProgress.user_id == current_user.id, QuizProgress.is_completed == False).order_by(QuizProgress.updated_at.desc()).first()`
    - Compare QuizProgress.updated_at with QuizAttempt.quiz_date
    - If QuizProgress exists and is more recent, use its chapter_id and session_key
    - Return both last_chapter_id and last_session_key in response
    - Update DashboardStats schema in `backend/app/schemas/statistics.py` to include last_session_key field
    - _Bug_Condition: isBugCondition(input) where input.action == "click" AND input.target == "Continue Chapter" on Dashboard_
    - _Expected_Behavior: System returns last_session_key for most recent incomplete quiz, enabling proper resume navigation_
    - _Preservation: New quiz starts and completed quiz tracking must continue to work identically_
    - _Requirements: 1.1, 2.1_

  - [ ] 3.2 Fix Frontend API: Add last_session_key to DashboardStats interface
    - File: `frontend/src/api/statistics.ts`
    - Interface: `DashboardStats`
    - Add new field: `last_session_key?: string`
    - This enables the Dashboard component to receive and use the session_key
    - _Bug_Condition: isBugCondition(input) where Dashboard navigation is missing session_key parameter_
    - _Expected_Behavior: Dashboard receives session_key from API and can construct proper navigation URL_
    - _Preservation: All other dashboard statistics continue to work identically_
    - _Requirements: 1.1, 2.1_

  - [ ] 3.3 Fix Dashboard: Update "Continue Chapter" button to include session_key parameter
    - File: `frontend/src/pages/Dashboard.tsx`
    - Component: `Dashboard`
    - Update "Continue Chapter" Link component's `to` prop
    - Change from: `/quiz/${stats.last_chapter_id}`
    - Change to: `stats.last_session_key ? /quiz/${stats.last_chapter_id}?session_key=${encodeURIComponent(stats.last_session_key)} : /quiz/${stats.last_chapter_id}`
    - Use conditional to handle case where last_session_key is not available (fallback to old behavior)
    - _Bug_Condition: isBugCondition(input) where input.action == "click" AND input.target == "Continue Chapter" AND session_key parameter is missing_
    - _Expected_Behavior: Navigation URL includes session_key parameter, enabling state restoration in Quiz component_
    - _Preservation: Dashboard UI and all other navigation must continue to work identically_
    - _Requirements: 1.1, 2.1_

  - [ ] 3.4 Fix useQuizState: Update normalizeState to preserve all saved state fields
    - File: `frontend/src/hooks/useQuizState.ts`
    - Function: `normalizeState`
    - Change normalization strategy from "validate structure" to "preserve all saved values"
    - Use spread operator to preserve ALL saved state fields: `return { ...state, ... }`
    - Preserve saved config instead of using default: `config: state.config` (not `state.config ?? config`)
    - Preserve saved current_question_index with proper bounds checking
    - Preserve saved answers Map directly: `answers: state.answers`
    - Preserve saved timer state: `start_time: state.start_time, elapsed_time: state.elapsed_time`
    - Preserve saved flags: `is_paused: state.is_paused, is_completed: state.is_completed`
    - Only use fresh questions if saved questions are missing: `questions: state.questions?.length ? state.questions : questions`
    - _Bug_Condition: isBugCondition(input) where saved state exists but is not properly restored by normalizeState_
    - _Expected_Behavior: All saved state fields are preserved exactly, enabling quiz to resume at saved position with all progress intact_
    - _Preservation: New quiz initialization (no saved state) must continue to work identically_
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

  - [ ] 3.5 Verify deserializeQuizState properly converts answers Record to Map
    - File: `frontend/src/lib/quizProgress.ts`
    - Function: `deserializeQuizState`
    - Verify that answers (stored as Record<number, QuizAnswer> in backend) are converted to Map<number, QuizAnswer>
    - Ensure conversion: `const answersMap = new Map<number, QuizAnswer>(Object.entries(state.answers).map(([key, value]) => [Number(key), value]))`
    - Return state with converted answers: `return { ...state, answers: answersMap }`
    - If conversion already exists, verify it's working correctly
    - If conversion is missing, add it
    - _Bug_Condition: isBugCondition(input) where saved answers fail to deserialize from backend JSON to frontend Map_
    - _Expected_Behavior: Answers are properly converted from Record to Map, preserving all answer data_
    - _Preservation: All other quiz progress deserialization must continue to work identically_
    - _Requirements: 1.6, 2.6_

  - [ ] 3.6 Verify bug condition exploration tests now pass
    - **Property 1: Expected Behavior** - Quiz Resume Restores Saved State
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run all exploration tests from task 1 (1.1-1.7)
    - **EXPECTED OUTCOME**: All tests PASS (confirms bugs are fixed)
    - Test 1.1: Dashboard navigation includes session_key parameter
    - Test 1.2: useQuizState restores current_question_index correctly
    - Test 1.3: useQuizState restores answers Map correctly
    - Test 1.4: useQuizState restores config correctly
    - Test 1.5: getDashboard returns in-progress quiz with session_key
    - Test 1.6: useQuizState restores bookmarks correctly
    - Test 1.7: useQuizState restores timer state correctly
    - Document that all tests now pass
    - _Requirements: All Expected Behavior requirements (2.1-2.9)_

  - [ ] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - New Quiz and Quiz Interaction Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run all preservation tests from task 2 (2.1-2.9)
    - **EXPECTED OUTCOME**: All tests PASS (confirms no regressions)
    - Test 2.1: New quiz initialization behavior unchanged
    - Test 2.2: Answer selection behavior unchanged
    - Test 2.3: Bookmark behavior unchanged
    - Test 2.4: Navigation behavior unchanged
    - Test 2.5: Save & Exit behavior unchanged
    - Test 2.6: Quiz mode enforcement unchanged
    - Test 2.7: Timer functionality unchanged
    - Test 2.8: Chapter card display unchanged
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: All Preservation Requirements (3.1-3.13)_

- [ ] 4. Integration Testing

  - [ ] 4.1 Test full user flow: Dashboard resume
    - Start quiz on Chapter 3, answer 5 questions, bookmark 2 questions, Save & Exit
    - Navigate to Dashboard
    - Click "Continue Chapter" button
    - Verify navigation URL includes session_key parameter
    - Verify Quiz component loads and displays Question 6 (saved position)
    - Verify all 5 previous answers are restored
    - Verify 2 bookmarks are restored
    - Verify quiz mode and timer configuration match saved state
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 2.8_

  - [ ] 4.2 Test full user flow: Chapter card resume
    - Start quiz on Chapter 5 in exam mode with 30-minute timer, answer 8 questions, Save & Exit
    - Navigate to Chapter list
    - Click "Continue from Q9" button on Chapter 5 card
    - Verify Quiz component loads and displays Question 9 (saved position)
    - Verify all 8 previous answers are restored
    - Verify quiz is in exam mode (no feedback shown)
    - Verify timer continues from saved elapsed_time
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.8, 2.9_

  - [ ] 4.3 Test edge case: Multiple in-progress quizzes
    - Start quiz on Chapter 2, answer 3 questions, Save & Exit (updated_at = today 10:00 AM)
    - Start quiz on Chapter 7, answer 5 questions, Save & Exit (updated_at = today 2:00 PM)
    - Navigate to Dashboard
    - Verify "Continue Chapter" shows Chapter 7 (most recent)
    - Click "Continue Chapter" and verify Chapter 7 quiz resumes at Question 6
    - Navigate back to Chapter list
    - Click "Continue from Q4" on Chapter 2 card
    - Verify Chapter 2 quiz resumes at Question 4
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 4.4 Test edge case: Completed quiz vs in-progress quiz
    - Complete quiz on Chapter 1 (QuizAttempt created yesterday)
    - Start quiz on Chapter 4, answer 6 questions, Save & Exit (QuizProgress updated today)
    - Navigate to Dashboard
    - Verify "Continue Chapter" shows Chapter 4 (in-progress, not completed)
    - Verify getDashboard API returns last_chapter_id = 4 and last_session_key for Chapter 4
    - _Requirements: 2.1_

  - [ ] 4.5 Test edge case: Resume with no saved progress (new quiz)
    - Navigate to Dashboard (no in-progress quizzes)
    - Verify "Continue Chapter" button is not shown OR navigates without session_key
    - Start new quiz on Chapter 8 with custom config (practice mode, 60-second timer per question, questions 10-30)
    - Verify quiz starts from Question 10 (first in range)
    - Verify config matches user selection
    - Verify answers Map is initialized with fresh state
    - _Requirements: 3.1, 3.2_

  - [ ] 4.6 Test timer restoration across resume
    - Start quiz with whole_test timer (30 minutes), answer 10 questions over 15 minutes, Save & Exit
    - Verify QuizProgress.elapsed_time = 900 seconds (15 minutes)
    - Resume quiz from Dashboard
    - Verify timer shows 15 minutes remaining (30 - 15)
    - Continue quiz for 5 more minutes
    - Verify elapsed_time increases correctly
    - _Requirements: 2.5, 2.6_

  - [ ] 4.7 Test answer and bookmark preservation across multiple resume cycles
    - Start quiz, answer questions 1-5, bookmark questions 2 and 4, Save & Exit
    - Resume quiz, answer questions 6-10, bookmark question 7, Save & Exit
    - Resume quiz again
    - Verify all answers from questions 1-10 are present
    - Verify bookmarks on questions 2, 4, and 7 are present
    - Navigate back to question 3, verify answer is still selected
    - _Requirements: 2.6_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ran the exploration and preservation regression suites for the resume flow and they passed
  - Ran the integration-style dashboard resume regression tests and they passed
  - Verified no test failures in the targeted frontend/backend suites for this bugfix
  - Result: 8 frontend tests passed and 2 backend tests passed
