import React, { useState } from 'react';
import './AiCoach.css';

// 環境変数からベースURLを取得（フォールバックは http://localhost:8000）
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

// トークン取得関数
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('eng_learning_access_token');
};

export default function AICoach({ context, onClose }) {
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachAnswer, setCoachAnswer] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState('');

  const submitCoachQuestion = async () => {
    if (!coachQuestion.trim()) {
      setCoachError('質問を入力してください。');
      return;
    }

    setCoachLoading(true);
    setCoachError('');
    setCoachAnswer('');

    try {
      const authToken = getAuthToken();
      
      // API_BASE_URL を使用してエンドポイントを呼び出し
      const response = await fetch(`${API_BASE_URL}/ai/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          question: coachQuestion.trim(),
          context: context,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        const detail = error?.detail || response.statusText;
        throw new Error(detail);
      }

      const result = await response.json();
      setCoachAnswer(result.answer || 'AIからの応答がありませんでした。');
    } catch (err) {
      setCoachError(err instanceof Error ? err.message : 'AIへの問い合わせに失敗しました。');
    } finally {
      setCoachLoading(false);
    }
  };

  return (
    <div className="reading-consultant-panel animate-slide-in">
      <div className="consultant-header">
        <div>
          <h3>AIコーチ</h3>
          <p>質問を入力してヒントをもらいましょう。</p>
        </div>
        <button className="consultant-close-btn" onClick={onClose}>閉じる</button>
      </div>
      
      <textarea
        className="consultant-textarea"
        placeholder="例えば：この単語の覚え方を教えてください。"
        rows="6"
        value={coachQuestion}
        onChange={(e) => {
          setCoachQuestion(e.target.value);
          if (coachError) setCoachError('');
        }}
      />
      
      <button className="consultant-submit-btn" onClick={submitCoachQuestion} disabled={coachLoading}>
        {coachLoading ? '送信中…' : '送信する'}
      </button>
      
      {coachError && <p className="consultant-error-text">{coachError}</p>}
      
      {coachAnswer && (
        <div className="consultant-answer-box">
          <h4>AIコーチの回答</h4>
          <p>{coachAnswer}</p>
        </div>
      )}
    </div>
  );
}