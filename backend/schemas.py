from pydantic import BaseModel, EmailStr
from typing import List, Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignUpRequest(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: str


class VerifySignupRequest(BaseModel):
    email: EmailStr
    code: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirmRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str


class AiVocabWordResponse(BaseModel):
    word: str
    pos: Optional[str] = None
    meaning: str


class AiVocabListResponse(BaseModel):
    id: int
    title: str
    level: int
    words_count: int
    created_at: str
    words: List[AiVocabWordResponse] = []


class CreateAiVocabRequest(BaseModel):
    email: str
    title: Optional[str] = None
    level: int
    amount: int




class ReadingQuestionResponse(BaseModel):
    id: str
    questionNumber: int
    questionText: str
    choices: List[str]
    correct: str
    explanation: str

    class Config:
        from_attributes = True


class ReadingStageResponse(BaseModel):
    id: str
    title: str
    passageType: str
    passage: str
    questions: List[ReadingQuestionResponse]

    class Config:
        from_attributes = True


class CourseProgressRequest(BaseModel):
    progress: dict[str, int]


class CourseProgressResponse(BaseModel):
    course_key: str
    progress: dict[str, int]

    class Config:
        allow_population_by_field_name = True
