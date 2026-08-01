import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

from database import engine, Base
from routers.auth import router as auth_router
from routers.ai_vocab import router as ai_vocab_router
from routers.reading import router as reading_router
from routers.progress import router as progress_router
from rag import build_knowledge_base_from_frontend, retrieve_relevant_context

# .envファイルから環境変数を読み込み
load_dotenv()

# リクエストとレスポンスの型定義
class AIQuestionRequest(BaseModel):
    question: str
    context: str | None = None

class AIQuestionResponse(BaseModel):
    answer: str

# データベースのテーブル作成（新設した reading_passages / reading_questions も作成されます）
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:4173", 
        "http://127.0.0.1:4173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーティングの追加
app.include_router(auth_router, prefix="")
app.include_router(ai_vocab_router, prefix="/ai-vocab")
app.include_router(reading_router, prefix="/reading")
app.include_router(progress_router, prefix="/progress")

@app.post("/ai/question", response_model=AIQuestionResponse)
def ask_ai_question(request: AIQuestionRequest):
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="AI API key is not configured.")

    knowledge_base = request.context or build_knowledge_base_from_frontend()
    retrieved_context = retrieve_relevant_context(request.question.strip(), knowledge_base)

    if retrieved_context:
        prompt_text = (
            "You are an AI English coach. Use the following retrieved passages as context and answer the user's question clearly in Japanese.\n\n"
            f"Retrieved passages:\n{retrieved_context}\n\nQuestion:\n{request.question.strip()}"
        )
    else:
        prompt_text = (
            "You are an AI English coach. Answer the user's question clearly in Japanese.\n\n"
            f"Question:\n{request.question.strip()}"
        )

    try:
        client = genai.Client(api_key=api_key)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_text,
        )
        
        if response.text:
            return {"answer": response.text}
            
    except Exception as e:
        print(f"Gemini API Error: {str(e)} - main.py:81")
        raise HTTPException(status_code=502, detail=f"AI API request failed: {str(e)}")

    raise HTTPException(status_code=502, detail="AI API did not return a valid answer.")