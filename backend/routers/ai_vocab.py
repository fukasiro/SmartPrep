import json
import os
import re
from pathlib import Path

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from google import genai

from database import get_db
from models import AiVocabList, AiVocabWord
from schemas import AiVocabListResponse, AiVocabWordResponse, CreateAiVocabRequest

router = APIRouter()


def resolve_course_directory() -> Path:
    current_file = Path(__file__).resolve()
    candidates = [
        current_file.parents[2] / 'front' / 'src' / 'features' / 'vocabulary' / 'courses',
        current_file.parents[1] / 'front' / 'src' / 'features' / 'vocabulary' / 'courses',
        current_file.parent / 'front' / 'src' / 'features' / 'vocabulary' / 'courses',
    ]

    for candidate in candidates:
        if candidate.exists():
            return candidate

    raise FileNotFoundError(
        'Could not locate frontend vocabulary course files. Tried: ' + ', '.join(str(p) for p in candidates)
    )


def parse_ai_generated_words(raw_text: str, expected_amount: int) -> List[dict]:
    if not raw_text or not raw_text.strip():
        raise ValueError('AI生成結果が空です。')

    cleaned = raw_text.strip()
    parsed = None

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r'(\[.*\])', cleaned, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group(1))
            except json.JSONDecodeError as exc:
                raise ValueError(f'JSON解析に失敗しました: {exc}')
        else:
            raise ValueError('AI生成結果にJSON配列が見つかりませんでした。')

    if not isinstance(parsed, list):
        raise ValueError('AI生成結果は配列形式である必要があります。')

    words = []
    for item in parsed[:expected_amount]:
        if not isinstance(item, dict):
            continue
        word = str(item.get('word', '')).strip()
        pos = item.get('pos')
        pos = str(pos).strip() if pos is not None else None
        meaning = str(item.get('meaning', '')).strip()

        if not word or not meaning:
            continue

        words.append({
            'word': word,
            'pos': pos or None,
            'meaning': meaning,
        })

    if len(words) < expected_amount:
        raise ValueError('AI生成結果の単語数が不足しています。')

    return words


def generate_ai_vocab_words(level: int, amount: int) -> List[dict]:
    api_key = os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail='AI APIキーが設定されていません。')

    level_description = {
        450: '基礎～初級レベルの英単語',
        600: '初中級レベルの英単語',
        730: '中級～上級レベルの英単語',
        860: '上級レベルの英単語',
    }.get(level, f'{level} レベル相当の英単語')

    prompt = (
        f'あなたは日本語学習者向けの英単語帳を作るアシスタントです。'
        f' 以下の条件に従い、必ずJSON配列のみを出力してください。\n'
        f'- 単語数: {amount}件\n'
        f'- レベル: {level_description}\n'
        f'- 各要素は word, pos, meaning の3つのキーを持つオブジェクトとする\n'
        f'- word は英単語、pos は日本語の品詞、meaning は日本語の意味を返す\n'
        f'- 余計な説明文やコードブロックを出力しない\n'
        '\n'
        '[\n'
        '  {"word": "accept", "pos": "動詞", "meaning": "受け入れる、承諾する"},\n'
        '  ...\n'
        ']'
    )

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f'AI生成に失敗しました: {exc}')

    generated_text = getattr(response, 'text', '')
    if not generated_text:
        raise HTTPException(status_code=502, detail='AI生成から有効な結果が返りませんでした。')

    try:
        return parse_ai_generated_words(generated_text, amount)
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=f'AI生成結果の解析に失敗しました: {exc}')


def select_word_data(level: int, amount: int) -> List[dict]:
    base_dir = resolve_course_directory()
    word_files = {
        450: '450_wordlist.js',
        600: '600_wordlist.js',
        730: '730_wordlist.js',
        860: '860_wordlist.js',
    }
    selected = []
    file_name = word_files.get(level, '450_wordlist.js')
    filepath = base_dir / file_name

    if not filepath.exists():
        raise FileNotFoundError(f"word list file not found: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = re.findall(r"\{\s*id:\s*(\d+),\s*word:\s*'([^']+)',\s*pos:\s*'([^']+)',\s*meaning:\s*'([^']+)'\s*\}", content)
    for match in matches[:amount]:
        selected.append({
            'word': match[1],
            'pos': match[2],
            'meaning': match[3],
        })

    return selected


@router.post('/create', response_model=AiVocabListResponse)
def create_ai_vocab(request: CreateAiVocabRequest, db: Session = Depends(get_db)):
    if request.amount <= 0 or request.amount > 100:
        raise HTTPException(status_code=400, detail='作成する単語数は1〜100の間で指定してください。')

    try:
        vocab_words = generate_ai_vocab_words(request.level, request.amount)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'AI単語帳生成中に予期せぬエラーが発生しました: {exc}')

    vocab_list = AiVocabList(
        user_email=request.email,
        title=request.title or f'AI単語帳 ({request.level} レベル)',
        level=request.level,
        words_count=len(vocab_words),
        created_at=datetime.utcnow(),
    )
    db.add(vocab_list)
    db.commit()
    db.refresh(vocab_list)

    for word_data in vocab_words:
        word = AiVocabWord(
            list_id=vocab_list.id,
            word=word_data['word'],
            pos=word_data['pos'],
            meaning=word_data['meaning'],
            created_at=datetime.utcnow(),
        )
        db.add(word)
    db.commit()
    db.refresh(vocab_list)

    return AiVocabListResponse(
        id=vocab_list.id,
        title=vocab_list.title,
        level=vocab_list.level,
        words_count=vocab_list.words_count,
        created_at=vocab_list.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        words=[AiVocabWordResponse(word=w.word, pos=w.pos, meaning=w.meaning) for w in vocab_list.words],
    )


@router.get('/lists', response_model=List[AiVocabListResponse])
def get_ai_vocab_lists(email: str, db: Session = Depends(get_db)):
    # 認証ガードを外して直接emailを絞り込みに使う
    lists = db.query(AiVocabList).filter(AiVocabList.user_email == email).order_by(AiVocabList.created_at.desc()).all()
    result = []
    for vocab_list in lists:
        result.append(AiVocabListResponse(
            id=vocab_list.id,
            title=vocab_list.title,
            level=vocab_list.level,
            words_count=vocab_list.words_count,
            created_at=vocab_list.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            words=[AiVocabWordResponse(word=w.word, pos=w.pos, meaning=w.meaning) for w in vocab_list.words],
        ))
    return result