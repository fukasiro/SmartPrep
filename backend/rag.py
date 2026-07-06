import json
import os
import re
from typing import List


def split_into_chunks(text: str, chunk_size: int = 300) -> List[str]:
    if not text or not text.strip():
        return []

    normalized = re.sub(r"\s+", " ", text).strip()
    if len(normalized) <= chunk_size:
        return [normalized]

    chunks = []
    start = 0
    while start < len(normalized):
        end = start + chunk_size
        if end < len(normalized):
            break_index = normalized.rfind(".", start, end)
            if break_index == -1:
                break_index = end
            end = break_index + 1
        else:
            end = len(normalized)
        chunk = normalized[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end
    return chunks


def build_knowledge_base_from_frontend(base_dir: str | None = None) -> str:
    if base_dir is None:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "front", "src", "features"))

    entries = []

    vocab_path = os.path.join(base_dir, "vocabulary", "courses", "600_wordlist.js")
    if os.path.exists(vocab_path):
        with open(vocab_path, "r", encoding="utf-8") as handle:
            vocab_text = handle.read()
        entries.append("Vocabulary data:\n" + vocab_text)

    reading_path = os.path.join(base_dir, "Reading", "courses", "450_Reading.js")
    if os.path.exists(reading_path):
        with open(reading_path, "r", encoding="utf-8") as handle:
            reading_text = handle.read()
        entries.append("Reading data:\n" + reading_text)

    return "\n\n".join(entries)


def retrieve_relevant_context(question: str, knowledge_base: str, top_k: int = 3) -> str:
    if not question or not knowledge_base:
        return ""

    chunks = split_into_chunks(knowledge_base)
    if not chunks:
        return ""

    q = question.lower()
    scored = []
    for chunk in chunks:
        chunk_lower = chunk.lower()
        score = 0
        if q in chunk_lower:
            score += 5
        for token in re.findall(r"[a-z]+", q):
            if token and token in chunk_lower:
                score += 1
        scored.append((score, chunk))

    scored.sort(key=lambda item: item[0], reverse=True)
    top_chunks = [chunk for _, chunk in scored[:top_k] if chunk]
    return "\n\n".join(top_chunks)
