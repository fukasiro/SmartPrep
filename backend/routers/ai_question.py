import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from google import genai

from rag import build_knowledge_base_from_frontend, retrieve_relevant_context
from schemas import AIQuestionRequest, AIQuestionResponse


router = APIRouter()

@router.post("/question", response_model=AIQuestionResponse)
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
            model='gemini-3.6-flash',
            contents=prompt_text,
        )
        
        if response.text:
            return {"answer": response.text}
            
    except Exception as e:
        print(f"Gemini API Error: {str(e)} - main.py:81")
        raise HTTPException(status_code=502, detail=f"AI API request failed: {str(e)}")

    raise HTTPException(status_code=502, detail="AI API did not return a valid answer.")