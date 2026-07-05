# Bugfix Requirements Document

## Introduction

This bugfix addresses a critical issue where the "Continue Quiz" functionality fails to resume quizzes from their saved positions. When users save and exit a quiz, then attempt to continue from either the Chapter card or Dashboard, the quiz incorrectly starts from Question 1 in exam mode, ignoring all saved progress including the current question index, selected answers, quiz mode (practice/exam), timer configuration, and other state data.

This bug severely impacts user experience by forcing users to restart quizzes from the beginning, wasting time and losing their progress. The issue affects two entry points:
1. Chapter card "Continue from Q{X}" button
2. Dashboard "Continue Chapter" button

The root causes include missing `session_key` parameter in Dashboard navigation and improper state restoration logic in the `useQuizState` hook.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user clicks "Continue Chapter" from the Dashboard THEN the system navigates to `/quiz/${chapter_id}` without the `session_key` parameter

1.2 WHEN a user clicks "Continue from Q{X}" from a Chapter card THEN the system navigates with `session_key` parameter but the quiz state is not restored from the saved progress

1.3 WHEN the Quiz component receives a `session_key` parameter THEN the system loads progress data but fails to restore the `current_question_index` to the saved position

1.4 WHEN the Quiz component receives a `session_key` parameter THEN the system fails to restore the quiz mode (practice/exam) to the saved preference

1.5 WHEN the Quiz component receives a `session_key` parameter THEN the system fails to restore timer configuration (timer mode and timer value) from the saved state

1.6 WHEN the Quiz component receives a `session_key` parameter THEN the system fails to restore user answers, bookmarks, and visited questions from the saved state

1.7 WHEN the Quiz component receives a `session_key` parameter THEN the system fails to restore the batch size and question range configuration from the saved state

1.8 WHEN quiz state restoration occurs THEN the system always starts from Question 1 regardless of the saved `current_question_index`

1.9 WHEN quiz state restoration occurs THEN the system always defaults to exam mode regardless of the saved mode preference

### Expected Behavior (Correct)

2.1 WHEN a user clicks "Continue Chapter" from the Dashboard THEN the system SHALL navigate to `/quiz/${chapter_id}?session_key=${session_key}` with the correct session key parameter

2.2 WHEN a user clicks "Continue from Q{X}" from a Chapter card THEN the system SHALL navigate with the `session_key` parameter and fully restore all quiz state from saved progress

2.3 WHEN the Quiz component receives a `session_key` parameter THEN the system SHALL load progress data and restore `current_question_index` to the exact saved question position

2.4 WHEN the Quiz component receives a `session_key` parameter THEN the system SHALL restore the quiz mode (practice/exam) to match the saved preference

2.5 WHEN the Quiz component receives a `session_key` parameter THEN the system SHALL restore timer configuration (timer mode and timer value) to match the saved state

2.6 WHEN the Quiz component receives a `session_key` parameter THEN the system SHALL restore all user answers, bookmarks, visited questions, and time spent from the saved state

2.7 WHEN the Quiz component receives a `session_key` parameter THEN the system SHALL restore batch size and question range configuration from the saved state

2.8 WHEN quiz state restoration occurs with a saved `current_question_index` of N THEN the system SHALL display Question N as the active question

2.9 WHEN quiz state restoration occurs with a saved mode preference THEN the system SHALL initialize the quiz in that exact mode (practice or exam)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user starts a new quiz (without a `session_key` parameter) THEN the system SHALL CONTINUE TO initialize from Question 1 with default settings

3.2 WHEN a user starts a new quiz with custom configuration THEN the system SHALL CONTINUE TO respect the user's selected mode, timer settings, batch size, and question range

3.3 WHEN a user completes a quiz session THEN the system SHALL CONTINUE TO save progress data correctly with all state fields

3.4 WHEN a user navigates away from an active quiz THEN the system SHALL CONTINUE TO preserve the current state for future continuation

3.5 WHEN quiz progress is saved to the backend THEN the system SHALL CONTINUE TO include all necessary fields (current_question_index, mode, answers, configuration, etc.)

3.6 WHEN a user answers questions in a quiz THEN the system SHALL CONTINUE TO track and save answer selections correctly

3.7 WHEN a user uses the "Save & Exit" button THEN the system SHALL CONTINUE TO persist the current quiz state and return to the previous page

3.8 WHEN the Chapter card displays progress information THEN the system SHALL CONTINUE TO show the correct "Continue from Q{X}" text based on saved progress

3.9 WHEN a quiz is in practice mode THEN the system SHALL CONTINUE TO provide immediate feedback and allow answer changes

3.10 WHEN a quiz is in exam mode THEN the system SHALL CONTINUE TO enforce exam rules (no feedback, locked answers, timer constraints)

3.11 WHEN a user bookmarks a question THEN the system SHALL CONTINUE TO save and restore bookmark state correctly

3.12 WHEN timer is enabled in a quiz THEN the system SHALL CONTINUE TO track time spent and enforce timer limits

3.13 WHEN a user navigates between questions using Next/Previous buttons THEN the system SHALL CONTINUE TO function correctly in both new and resumed sessions
