import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ReadingPassage
from schemas import ReadingStageResponse

router = APIRouter()


@router.get("/courses/{level}", response_model=List[ReadingStageResponse])
def get_reading_course(level: int, db: Session = Depends(get_db)):
    passages = (
        db.query(ReadingPassage)
        .filter(ReadingPassage.course_level == level)
        .all()
    )

    if not passages:
        raise HTTPException(
            status_code=404, 
            detail=f"Level {level} reading course not found."
        )

    result = []
    for p in passages:
        # 設問を question_number 順にソート
        sorted_questions = sorted(p.questions, key=lambda x: x.question_number)
        questions_list = []
        for q in sorted_questions:
            questions_list.append({
                "id": q.id,
                "questionNumber": q.question_number,
                "questionText": q.question_text,
                "choices": json.loads(q.choices),  # JSON文字列を配列に変換
                "correct": q.correct,
                "explanation": q.explanation
            })

        result.append({
            "id": p.id,
            "title": p.title,
            "passageType": p.passage_type,
            "passage": p.passage,
            "questions": questions_list
        })

    return result