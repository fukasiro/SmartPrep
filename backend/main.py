import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers.ai_question import router as ai_question_router
from routers.ai_vocab import router as ai_vocab_router
from routers.auth import router as auth_router
from routers.progress import router as progress_router
from routers.reading import router as reading_router

# .envファイルから環境変数を読み込み
load_dotenv()


# データベースのテーブル作成（新設した reading_passages / reading_questions も作成されます）
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORSの設定
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173,https://smartprep.siro-siro509.workers.dev,https://smartprep.cc,https://www.smartprep.cc",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://[a-zA-Z0-9-]+\.workers\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーティングの追加
app.include_router(auth_router, prefix="")
app.include_router(ai_vocab_router, prefix="/ai-vocab")
app.include_router(reading_router, prefix="/reading")
app.include_router(progress_router, prefix="/progress")
app.include_router(ai_question_router, prefix="/ai")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

