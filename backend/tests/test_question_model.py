from types import SimpleNamespace
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.models.question import Question
from app.models.subject import Subject
from app.models.chapter import Chapter
from app.api import questions as questions_api
from app.core.database import SessionLocal
from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def override_auth_dependency():
    app.dependency_overrides[questions_api.get_current_user] = lambda: SimpleNamespace(id=1, username="testuser")
    yield
    app.dependency_overrides.clear()


def test_question_to_dict_includes_explanation_field():
    question = Question(
        chapter_id=1,
        question_number=1,
        question_text="What is 2 + 2?",
        option_a="3",
        option_b="4",
        option_c="5",
        option_d="6",
        correct_answer="B",
        explanation="Because 2 + 2 equals 4.",
    )

    data = question.to_dict()

    assert data["explanation"] == "Because 2 + 2 equals 4."


def test_question_defaults_explanation_to_none():
    question = Question(
        chapter_id=1,
        question_number=1,
        question_text="What is 2 + 2?",
        option_a="3",
        option_b="4",
        option_c="5",
        option_d="6",
        correct_answer="B",
    )

    assert question.explanation is None
    assert question.to_dict()["explanation"] is None


def test_bulk_create_questions_preserves_explanations():
    db = SessionLocal()
    try:
        subject = Subject(name='Test Subject', user_id=1)
        db.add(subject)
        db.commit()
        db.refresh(subject)

        chapter = Chapter(name='Test Chapter', subject_id=subject.id)
        db.add(chapter)
        db.commit()
        db.refresh(chapter)
    finally:
        db.close()

    payload = {
        "chapter_id": chapter.id,
        "questions": [
            {
                "question_number": 1,
                "question_text": "What is 2 + 2?",
                "option_a": "3",
                "option_b": "4",
                "option_c": "5",
                "option_d": "6",
                "correct_answer": "B",
                "explanation": "Because 2 + 2 equals 4."
            }
        ]
    }

    response = client.post('/api/questions/bulk', json=payload)

    assert response.status_code == 201
    assert response.json()['questions'][0]['explanation'] == 'Because 2 + 2 equals 4.'