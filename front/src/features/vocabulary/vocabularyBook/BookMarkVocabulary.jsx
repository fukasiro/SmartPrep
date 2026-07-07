import React, { useEffect, useState, useMemo } from 'react';
import './BookMarkVocabulary.css';
import { loadBookmarkedWords, removeBookmarkedWord, addBookmarkedWord } from '../progressStorage';

export default function BookMarkVocabulary({ onBack }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newPos, setNewPos] = useState('');
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // AIコーチ関連
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachAnswer, setCoachAnswer] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState('');

  // クイズ機能の状態管理
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizCountInput, setQuizCountInput] = useState('5'); // デフォルト5問
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const syncBookmarks = () => {
    setBookmarks(loadBookmarkedWords());
  };

  useEffect(() => {
    syncBookmarks();
    window.addEventListener('vocab-bookmarks-updated', syncBookmarks);
    return () => {
      window.removeEventListener('vocab-bookmarks-updated', syncBookmarks);
    };
  }, []);

  const handleRemove = (word) => {
    if (window.confirm(`「${word}」を削除してもよろしいですか？`)) {
      removeBookmarkedWord(word);
      syncBookmarks();
    }
  };

  const handleAddWord = (e) => {
    e.preventDefault();
    setFormError('');

    if (!newWord.trim() || !newMeaning.trim()) {
      setFormError('単語と意味は必須です');
      return;
    }

    const wordEntry = {
      word: newWord.trim(),
      meaning: newMeaning.trim(),
      pos: newPos.trim() || undefined,
      isCustom: true,
    };

    addBookmarkedWord(wordEntry);
    setNewWord('');
    setNewMeaning('');
    setNewPos('');
    setShowAddForm(false);
    syncBookmarks();
  };

  // 検索フィルタリング
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) {
      return bookmarks;
    }
    const query = searchQuery.toLowerCase();
    return bookmarks.filter(
      (item) =>
        item.word.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query) ||
        (item.pos && item.pos.toLowerCase().includes(query))
    );
  }, [bookmarks, searchQuery]);

  // AIコーチのコンテキスト
  const coachContext = useMemo(() => {
    const wordsList = bookmarks.map((word) => `${word.word}：${word.meaning}`).join('\n');
    return `ブックマーク単語帳の単語一覧:\n${wordsList}`;
  }, [bookmarks]);

  // AIコーチへの質問送信
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: coachQuestion.trim(), context: coachContext }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.detail || response.statusText);
      }
      const result = await response.json();
      setCoachAnswer(result.answer || 'AIからの応答がありませんでした。');
    } catch (err) {
      setCoachError(err instanceof Error ? err.message : 'AIへの問い合わせに失敗しました。');
    } finally {
      setCoachLoading(false);
    }
  };

  // ーーー クイズシステム ーーー
  const startQuiz = () => {
    if (bookmarks.length === 0) {
      alert('クイズを開始するには単語が1つ以上必要です。');
      return;
    }

    let targetCount = quizCountInput === 'all' ? bookmarks.length : parseInt(quizCountInput, 10);
    if (targetCount > bookmarks.length) targetCount = bookmarks.length;

    // 問題用単語をシャッフル
    const shuffledSource = [...bookmarks].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledSource.slice(0, targetCount);

    // 4択選択肢の組み立て
    const generatedQuestions = selectedWords.map((current) => {
      let distractors = bookmarks
        .filter((b) => b.word !== current.word)
        .map((b) => b.meaning);

      const backupDistractors = ['重要である', '発生する', 'を考慮する', '明確な', 'を維持する'];
      while (distractors.length < 3) {
        const fake = backupDistractors[Math.floor(Math.random() * backupDistractors.length)];
        if (!distractors.includes(fake) && fake !== current.meaning) {
          distractors.push(fake);
        }
      }

      distractors = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
      const choices = [...distractors, current.meaning].sort(() => Math.random() - 0.5);

      return {
        word: current.word,
        pos: current.pos,
        correctAnswer: current.meaning,
        choices: choices
      };
    });

    setQuizQuestions(generatedQuestions);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setIsQuizMode(true);
  };

  const handleAnswerSelect = (choice) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);

    if (choice === quizQuestions[currentQuizIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="vocab-list-container">
      <div className="reading-stage-card-wrapper">
        
        {/* 左側：メインカード */}
        <div className="reading-stage-card">
          <div className="vocab-list-card">
            
            {!isQuizMode ? (
              /* 通常の単語帳モード */
              <>
                <div className="text-center">
                  <h1 className="vocab-list-title">📚 ブックマーク単語帳</h1>
                  <p className="vocab-list-sub">登録した単語や自分で追加した単語をここで確認できます。</p>
                </div>

                {/* クイズ設定エリア（モダンにアップデート） */}
                {bookmarks.length > 0 && (
                  <div className="quiz-setup-card-premium">
                    <div className="quiz-setup-left">
                      <span className="quiz-setup-badge">MODE</span>
                      <h3 className="quiz-setup-lead">ランダム単語クイズ</h3>
                      <p className="quiz-setup-desc">記憶の定着度をテストしましょう。間違えた選択肢は自動生成されます。</p>
                    </div>
                    
                    <div className="quiz-setup-right">
                      <div className="quiz-count-selector-wrapper">
                        <label htmlFor="quiz-count-select" className="quiz-label-text">出題数</label>
                        <select 
                          id="quiz-count-select"
                          value={quizCountInput} 
                          onChange={(e) => setQuizCountInput(e.target.value)}
                          className="quiz-count-dropdown-modern"
                        >
                          <option value="5">5 問</option>
                          <option value="10">10 問</option>
                          <option value="20">20 問</option>
                          <option value="all">全問 ({bookmarks.length})</option>
                        </select>
                      </div>
                      <button onClick={startQuiz} className="quiz-start-btn-modern">
                        <span>⚡ クイズを開始</span>
                      </button>
                    </div>
                  </div>
                )}

                <main className="bookmark-vocab-main">
                  {/* 検索フォーム */}
                  <div className="bookmark-search-section">
                    <input
                      type="text"
                      placeholder="単語や意味で検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bookmark-search-input"
                    />
                  </div>

                  {/* 単語追加フォーム */}
                  <div className="bookmark-add-word-section">
                    {!showAddForm ? (
                      <button 
                        className="vocabulary-menu-primary-button w-100"
                        onClick={() => setShowAddForm(true)}
                      >
                        + 単語を追加
                      </button>
                    ) : (
                      <form className="bookmark-add-form" onSubmit={handleAddWord}>
                        <div className="form-group">
                          <label htmlFor="new-word">単語 <span className="required">*</span></label>
                          <input
                            id="new-word"
                            type="text"
                            placeholder="例: serendipity"
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="new-meaning">意味 <span className="required">*</span></label>
                          <textarea
                            id="new-meaning"
                            placeholder="例: 幸運な出来事"
                            value={newMeaning}
                            onChange={(e) => setNewMeaning(e.target.value)}
                            className="form-textarea"
                            rows="3"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="new-pos">品詞（オプション）</label>
                          <input
                            id="new-pos"
                            type="text"
                            placeholder="例: noun, verb, adjective"
                            value={newPos}
                            onChange={(e) => setNewPos(e.target.value)}
                            className="form-input"
                          />
                        </div>

                        {formError && <p className="form-error">{formError}</p>}

                        <div className="form-actions">
                          <button type="submit" className="vocabulary-menu-primary-button">追加</button>
                          <button 
                            type="button" 
                            className="vocabulary-menu-secondary-button"
                            onClick={() => {
                              setShowAddForm(false);
                              setNewWord('');
                              setNewMeaning('');
                              setNewPos('');
                              setFormError('');
                            }}
                          >
                            キャンセル
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* 単語リスト */}
                  {filteredBookmarks.length === 0 ? (
                    <div className="bookmark-vocab-empty">
                      <span className="bookmark-vocab-empty-icon">📚</span>
                      <p>
                        {searchQuery
                          ? '検索結果が見つかりませんでした。'
                          : 'まだ単語が登録されていません。'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="bookmark-vocab-count">{filteredBookmarks.length}個の単語</p>
                      <ul className="bookmark-vocab-list">
                        {filteredBookmarks.map((item) => (
                          <li key={item.word} className="bookmark-vocab-item">
                            <div className="bookmark-vocab-item-text">
                              <div className="bookmark-vocab-item-title-row">
                                <strong className="bookmark-vocab-word">{item.word}</strong>
                                {item.pos && <span className="bookmark-vocab-pos">{item.pos}</span>}
                                {item.isCustom && <span className="bookmark-vocab-custom-badge">カスタム</span>}
                              </div>
                              <p className="bookmark-vocab-meaning">{item.meaning}</p>
                            </div>
                            <button className="bookmark-vocab-remove-btn" onClick={() => handleRemove(item.word)}>
                              削除
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </main>
              </>
            ) : (
              /* クイズ進行・結果画面 */
              <div className="quiz-container">
                {!quizFinished ? (
                  <>
                    <div className="quiz-header">
                      <span className="quiz-progress-text">問題 {currentQuizIndex + 1} / {quizQuestions.length}</span>
                      <button onClick={() => setIsQuizMode(false)} className="quiz-abort-btn">クイズを終了</button>
                    </div>

                    <div className="quiz-question-box">
                      <h2 className="quiz-word">{quizQuestions[currentQuizIndex]?.word}</h2>
                      {quizQuestions[currentQuizIndex]?.pos && (
                        <span className="bookmark-vocab-pos">{quizQuestions[currentQuizIndex]?.pos}</span>
                      )}
                    </div>

                    <div className="quiz-choices-list">
                      {quizQuestions[currentQuizIndex]?.choices.map((choice, idx) => {
                        let btnClass = "quiz-choice-btn";
                        if (isAnswered) {
                          if (choice === quizQuestions[currentQuizIndex].correctAnswer) {
                            btnClass += " correct";
                          } else if (choice === selectedAnswer) {
                            btnClass += " incorrect";
                          } else {
                            btnClass += " disabled";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswerSelect(choice)}
                            disabled={isAnswered}
                            className={btnClass}
                          >
                            <span className="choice-number">{idx + 1}.</span> {choice}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="quiz-feedback-section">
                        <p className={`feedback-message ${selectedAnswer === quizQuestions[currentQuizIndex].correctAnswer ? 'good' : 'bad'}`}>
                          {selectedAnswer === quizQuestions[currentQuizIndex].correctAnswer ? '🎉 正解！' : '😢 不正解...'}
                        </p>
                        <button onClick={handleNextQuiz} className="vocabulary-menu-primary-button">
                          {currentQuizIndex + 1 === quizQuestions.length ? '結果を見る' : '次の問題へ →'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="quiz-result-view text-center">
                    <span className="result-icon">🏆</span>
                    <h2 className="result-title">クイズ終了！</h2>
                    <p className="result-score">スコア: <strong>{score}</strong> / {quizQuestions.length}</p>
                    <div className="result-actions">
                      <button onClick={startQuiz} className="vocabulary-menu-primary-button">もう一度挑戦する</button>
                      <button onClick={() => setIsQuizMode(false)} className="vocabulary-menu-secondary-button">単語帳に戻る</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <footer className="bookmark-vocab-footer">
              {onBack && !isQuizMode && (
                <button className="bookmark-vocab-back-btn" onClick={onBack}>
                  ← 戻る
                </button>
              )}
            </footer>
          </div>
        </div>

        {/* 右側：AIコーチパネル（位置ズレ完全ロック・同期化） */}
        <div className="reading-consultant-panel animate-slide-in">
          <div className="consultant-header">
            <div>
              <h3>🤖 AIコーチ</h3>
              <p>単語について質問してください</p>
            </div>
          </div>

          <textarea
            className="consultant-textarea"
            placeholder="例：acceptの使い方を教えて"
            value={coachQuestion}
            onChange={(e) => setCoachQuestion(e.target.value)}
            disabled={coachLoading}
          />

          <button onClick={submitCoachQuestion} disabled={coachLoading} className="consultant-submit-btn">
            {coachLoading ? '質問中...' : '質問する'}
          </button>

          {coachError && <p className="consultant-error-text">{coachError}</p>}

          {coachAnswer && (
            <div className="consultant-answer-box">
              <h4>AIからの回答</h4>
              <p>{coachAnswer}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}