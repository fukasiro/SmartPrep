import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import UserProgress
from schemas import CourseProgressRequest, CourseProgressResponse
from security import get_current_user

router = APIRouter()


@router.get("/{course_key}", response_model=CourseProgressResponse)
def get_course_progress(
    course_key: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress_entry = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == current_user.id, UserProgress.course_key == course_key)
        .first()
    )

    if not progress_entry:
        return {"course_key": course_key, "progress": {}}

    try:
        progress_data = json.loads(progress_entry.progress)
    except Exception:
        progress_data = {}

    return {"course_key": course_key, "progress": progress_data}


@router.post("/{course_key}", response_model=CourseProgressResponse)
def save_course_progress(
    course_key: str,
    request: CourseProgressRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress_json = json.dumps(request.progress)
    progress_entry = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == current_user.id, UserProgress.course_key == course_key)
        .first()
    )

    if progress_entry:
        progress_entry.progress = progress_json
        progress_entry.updated_at = datetime.utcnow()
    else:
        progress_entry = UserProgress(
            user_id=current_user.id,
            course_key=course_key,
            progress=progress_json,
        )
        db.add(progress_entry)

    db.commit()
    db.refresh(progress_entry)

    return {"course_key": course_key, "progress": request.progress}
