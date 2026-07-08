import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai  # 新しい公式SDK (google-genai) をインポート

from database import engine, Base
from routers.auth import router as auth_router
from routers.ai_vocab import router as ai_vocab_router
from rag import build_knowledge_base_from_frontend, retrieve_relevant_context

# .envファイルから環境変数を読み込み
load_dotenv()

# リクエストとレスポンスの型定義
class AIQuestionRequest(BaseModel):
    question: str
    context: str | None = None

class AIQuestionResponse(BaseModel):
    answer: str

# データベースのテーブル作成
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORSの設定（フロントエンドからのアクセスを許可）
# 💡 Docker環境の実行ポート「4173」を完全に追加しました
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

# 認証系とAI語彙ルーティングを追加
app.include_router(auth_router, prefix="")
app.include_router(ai_vocab_router, prefix="/ai-vocab")

@app.post("/ai/question", response_model=AIQuestionResponse)
def ask_ai_question(request: AIQuestionRequest):
    # APIキーの取得
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="AI API key is not configured.")

    # まずは検索して、関連する教材本文を取り出す
    knowledge_base = request.context or build_knowledge_base_from_frontend()
    retrieved_context = retrieve_relevant_context(request.question.strip(), knowledge_base)

    # プロンプトの組み立て
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
        # 新SDK用のクライアント初期化（リクエストごとに確実にキーを渡す）
        client = genai.Client(api_key=api_key)
        
        # 最新のgemini-2.5-flashを使用してテキスト生成
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_text,
        )
        
        # 返答テキストをチェックして返す
        if response.text:
            return {"answer": response.text}
            
    except Exception as e:
        print(f"Gemini API Error: {str(e)} - main.py:86")
        raise HTTPException(status_code=502, detail=f"AI API request failed: {str(e)}")

    raise HTTPException(status_code=502, detail="AI API did not return a valid answer.")