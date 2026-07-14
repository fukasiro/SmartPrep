// AICoach.jsx
import React, { useState } from 'react';
import './AICoach.css';

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
      const response = await fetch('http://localhost:8000/ai/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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