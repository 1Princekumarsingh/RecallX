from datetime import datetime, timezone
from types import SimpleNamespace
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.main import app
from app.api import statistics as statistics_api
from app.models.quiz_attempt import QuizAttempt
from app.models.quiz_progress import QuizProgress
from app.core.database import SessionLocal

client = TestClient(app)


@pytest.fixture(autouse=True)
def override_auth_dependency():
    app.dependency_overrides[statistics_api.get_current_user] = lambda: SimpleNamespace(id=1, username="testuser")
    yield
    app.dependency_overrides.clear()


@pytest.fixture(autouse=True)
def clear_data():
    db = SessionLocal()
    try:
        db.query(QuizProgress).delete()
        db.query(QuizAttempt).delete()
        db.commit()
    finally:
        db.close()


def test_dashboard_prefers_incomplete_quiz_progress_for_resume_link():
    db = SessionLocal()
    try:
        db.add(QuizAttempt(user_id=1, chapter_id=1, mode='practice', time_taken=30, correct=2, wrong=1, accuracy=66.7))
        db.add(QuizProgress(
            user_id=1,
            chapter_id=2,
            session_key='2-exam-unlimited---',
            config={'chapter_id': 2, 'mode': 'exam', 'timer_mode': 'unlimited'},
            state={'current_question_index': 4, 'config': {'mode': 'exam'}, 'answers': {}, 'questions': [], 'start_time': 1, 'elapsed_time': 2, 'is_paused': False, 'is_completed': False},
            is_completed=False,
        ))
        db.commit()
    finally:
        db.close()

    response = client.get('/api/statistics/dashboard')

    assert response.status_code == 200
    payload = response.json()
    assert payload['last_chapter_id'] == 2
    assert payload['last_session_key'] == '2-exam-unlimited---'


def test_dashboard_uses_the_most_recent_incomplete_progress_session():
    db = SessionLocal()
    try:
        db.add(QuizProgress(
            user_id=1,
            chapter_id=3,
            session_key='3-practice-unlimited---',
            config={'chapter_id': 3, 'mode': 'practice', 'timer_mode': 'unlimited'},
            state={'current_question_index': 1, 'config': {'mode': 'practice'}, 'answers': {}, 'questions': [], 'start_time': 1, 'elapsed_time': 30, 'is_paused': False, 'is_completed': False},
            is_completed=False,
            updated_at=datetime(2024, 1, 2, tzinfo=timezone.utc),
        ))
        db.add(QuizProgress(
            user_id=1,
            chapter_id=4,
            session_key='4-exam-unlimited---',
            config={'chapter_id': 4, 'mode': 'exam', 'timer_mode': 'unlimited'},
            state={'current_question_index': 6, 'config': {'mode': 'exam'}, 'answers': {}, 'questions': [], 'start_time': 1, 'elapsed_time': 120, 'is_paused': False, 'is_completed': False},
            is_completed=False,
            updated_at=datetime(2024, 1, 3, tzinfo=timezone.utc),
        ))
        db.commit()
    finally:
        db.close()

    response = client.get('/api/statistics/dashboard')

    assert response.status_code == 200
    payload = response.json()
    assert payload['last_chapter_id'] == 4
    assert payload['last_session_key'] == '4-exam-unlimited---'
