import React, { useEffect, useState, useRef, useMemo } from 'react';
import './AIConsultant.css';
import { loadBookmarkedWords, loadCourseProgress } from '../../vocabulary/progressStorage';

export default function AIConsultant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'こんにちは！👋 英語学習のAIコンサルタントです。\n\n学習の進捗状況、質問、アドバイスが必要なことなど、何でもお気軽にお聞きください。あなたの学習状況に基づいて、パーソナライズされたアドバイスを提供します。',
      timestamp: new Date(),
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // ユーザーの学習データを総合的に取得
  const userContext = useMemo(() => {
    const bookmarks = loadBookmarkedWords();
    const vocabContext = [];
    const readingContext = [];

    // 語彙コース進度
    const courseKeys = [
      { key: 'vocab_450_stage_scores', name: '450レベル', level: 450 },
      { key: 'vocab_600_stage_scores', name: '600レベル', level: 600 },
      { key: 'vocab_730_stage_scores', name: '730レベル', level: 730 },
      { key: 'vocab_860_stage_scores', name: '860レベル', level: 860 },
    ];

    courseKeys.forEach(({ key, name, level }) => {
      const progress = loadCourseProgress(key);
      if (progress && Object.keys(progress).length > 0) {
        const completedStages = Object.entries(progress)
          .filter(([_, score]) => score > 0)
          .length;
        vocabContext.push(`${name} (TOEIC${level}): ${completedStages}ステージ完了`);
      }
    });

    // リーディングコース進度
    const readingCourseKeys = [
      { key: 'reading_450_stage_scores', name: 'リーディング450', level: 450 },
      { key: 'reading_600_stage_scores', name: 'リーディング600', level: 600 },
      { key: 'reading_730_stage_scores', name: 'リーディング730', level: 730 },
      { key: 'reading_860_stage_scores', name: 'リーディング860', level: 860 },
    ];

    readingCourseKeys.forEach(({ key, name, level }) => {
      const progress = loadCourseProgress(key);
      if (progress && Object.keys(progress).length > 0) {
        const completedStages = Object.entries(progress)
          .filter(([_, score]) => score > 0)
          .length;
        readingContext.push(`${name} (TOEIC${level}): ${completedStages}ステージ完了`);
      }
    });

    return {
      bookmarkedWordsCount: bookmarks.length,
      customWordsCount: bookmarks.filter(w => w.isCustom).length,
      recentWords: bookmarks
        .slice(0, 15)
        .map((w) => `${w.word}(${w.pos || 'noun'}): ${w.meaning}`)
        .join('\n'),
      vocabCoursesStatus: vocabContext.length > 0 ? vocabContext.join('\n') : '学習中のコースなし',
      readingCoursesStatus: readingContext.length > 0 ? readingContext.join('\n') : 'リーディングコース未開始',
    };
  }, []);

  // メッセージをスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // メッセージ送信
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError('');

    try {
      // RAGコンテキストを構築
      const context = `
ユーザーの英語学習状況:

【ブックマーク単語帳】
- 総単語数: ${userContext.bookmarkedWordsCount}
- カスタム追加単語: ${userContext.customWordsCount}
- 最近のブックマーク単語:
${userContext.recentWords || 'なし'}

【語彙コース進度（TOEIC対策）】
${userContext.vocabCoursesStatus}

【リーディングコース進度（TOEIC対策）】
${userContext.readingCoursesStatus}

ユーザーの質問に対して、上記の学習状況を考慮した実用的でパーソナライズされたアドバイスを日本語で提供してください。学習レベルやスピードに合わせた、次のステップやモチベーション維持のコツなど、具体的なアドバイスを心がけてください。
      `.trim();

      const response = await fetch('http://localhost:8000/ai/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userInput.trim(),
          context: context,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `エラー: ${response.statusText}`);
      }

      const result = await response.json();
      const assistantMessage = {
        id: messages.length + 2,
        sender: 'assistant',
        text: result.answer || 'AIからの応答がありませんでした。',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AIへの問い合わせに失敗しました。');
      const errorMessage = {
        id: messages.length + 2,
        sender: 'assistant',
        text: `申し訳ございません。エラーが発生しました：\n${err instanceof Error ? err.message : '不明なエラー'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // サンプル質問のクイック送信
  const handleQuickQuestion = (question) => {
    setUserInput(question);
  };

  return (
    <main className="ai-consultant-page">
      <section className="ai-consultant-header">
        <div className="ai-consultant-title-section">
          <h1> <svg
  viewBox="0 0 24 24"
  className="menu-svg-icon"
  aria-hidden="true"
>
  <path
    d="M12 3v2"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
  <rect
    x="5"
    y="5"
    width="14"
    height="12"
    rx="4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  />
  <circle cx="9.5" cy="10.5" r="1" fill="currentColor" />
  <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
  <path
    d="M9.5 14c.8.6 1.6.9 2.5.9s1.7-.3 2.5-.9"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
</svg> AI English Consultant</h1>
          <p>あなたの学習に合わせた、パーソナライズされたアドバイス</p>
        </div>
        <button className="ai-consultant-close-btn" onClick={onClose}>
          ✕
        </button>
      </section>

      <section className="ai-consultant-chat-section">
        <div className="ai-consultant-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`ai-consultant-message ${msg.sender === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-avatar">
                {msg.sender === 'user' ? '👤' :  <svg
  viewBox="0 0 24 24"
  className="menu-svg-icon"
  aria-hidden="true"
>
  <path
    d="M12 3v2"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
  <rect
    x="5"
    y="5"
    width="14"
    height="12"
    rx="4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  />
  <circle cx="9.5" cy="10.5" r="1" fill="currentColor" />
  <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
  <path
    d="M9.5 14c.8.6 1.6.9 2.5.9s1.7-.3 2.5-.9"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
</svg>}
              </div>
              <div className="message-bubble">
                <p className="message-text">{msg.text}</p>
              </div>
            </div>
          ))}
            {isLoading && (
            <div className="ai-consultant-message assistant-message">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="ai-consultant-error">
            ⚠️ {error}
          </div>
        )}

        <div className="ai-consultant-footer">
          <div className="quick-questions-section">
            <p className="quick-label">💡 サンプル質問:</p>
            <div className="quick-buttons">
              <button
                className="quick-btn"
                onClick={() => handleQuickQuestion('今日の効率的な学習プランを教えてください')}
              >
                今日の学習プラン
              </button>
              <button
                className="quick-btn"
                onClick={() => handleQuickQuestion('ブックマークした単語をより効率的に学習する方法は？')}
              >
                単語学習の工夫
              </button>
              <button
                className="quick-btn"
                onClick={() => handleQuickQuestion('次に進むべきコースレベルはどれですか？')}
              >
                次のレベル相談
              </button>
              <button
                className="quick-btn"
                onClick={() => handleQuickQuestion('英語学習のモチベーション維持のコツは？')}
              >
                モチベーション
              </button>
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="ai-consultant-input-form">
            <div className="ai-consultant-input-wrapper">
              <textarea
                className="ai-consultant-textarea"
                placeholder="ここに質問を入力してください..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                disabled={isLoading}
                rows="2"
              />
              <button
                type="submit"
                className="ai-consultant-submit-btn"
                disabled={!userInput.trim() || isLoading}
              >
                {isLoading ? '...' : '送信'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
