import { useEffect, useState, useCallback, useMemo } from 'react';
import './AiVocabulary.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

// 🎲 確実なシャッフルを行うためのFisher-Yatesアルゴリズム
const shuffleArray = (array) => {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

export default function AiVocabulary({ onBack, userEmail: propUserEmail }) {
  const [viewMode, setViewMode] = useState('list'); 
  const [vocabLists, setVocabLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null); 
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(450);
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 🔍 検索機能用
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // ✨ AI自動追加用
  const [generateAmount, setGenerateAmount] = useState(5);
  const [generating, setGenerating] = useState(false);

  // 📝 クイズ機能用
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // クイズ出題数選択用モーダル
  const [showQuizCountModal, setShowQuizCountModal] = useState(false);
  const [selectedQuizCount, setSelectedQuizCount] = useState(10);

  // AIコーチ機能用（スマホ時の開閉状態管理）
  const [showConsultantPanel, setShowConsultantPanel] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachAnswer, setCoachAnswer] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState('');

  const [userEmail, setUserEmail] = useState(propUserEmail || '');
  const [isInitialized, setIsInitialized] = useState(false); 

  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('eng_learning_access_token');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('eng_learning_user');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.email) setUserEmail(parsed.email);
        } catch (e) {
          console.error('JSONパース失敗');
        }
      }
    }
    if (propUserEmail) setUserEmail(propUserEmail);
    setIsInitialized(true);
  }, [propUserEmail]);

  const fetchLists = useCallback(async (email) => {
    setLoading(true);
    setError('');
    const url = `${API_BASE_URL}/ai-vocab/lists?email=${encodeURIComponent(email)}`;
    try {
      const authToken = getAuthToken();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });
      if (!response.ok) throw new Error(`サーバーエラー (Status: ${response.status})`);
      const data = await response.json();
      const listsArray = Array.isArray(data) ? data : [];
      setVocabLists(listsArray);

      setSelectedList((prevSelected) => {
        if (!prevSelected) return null;
        return listsArray.find((l) => l.id === prevSelected.id) || prevSelected;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '読み込みエラー');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return; 
    if (!userEmail) {
      setError('ログインしてAI単語帳を管理してください。');
      setLoading(false);
      return;
    }
    fetchLists(userEmail);
  }, [isInitialized, userEmail, fetchLists]);

  const handleCreateList = async () => {
    if (!userEmail) return;
    setLoading(true);
    setError('');
    try {
      const authToken = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/ai-vocab/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          email: userEmail,
          title: newTitle.trim() || `AI単語帳 ${selectedLevel} レベル`,
          level: selectedLevel,
          amount,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || '作成失敗');

      setVocabLists((prev) => [result, ...prev]);
      setIsCreating(false);
      setNewTitle('');
      setSuccessMessage('AI単語帳を作成しました。');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '作成エラー');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchWord = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError('');
    try {
      const authToken = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/ai-vocab/search-word?q=${encodeURIComponent(searchQuery)}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        const resultsArray = Array.isArray(data) ? data : [data];
        setSearchResults(resultsArray);
      } else {
        setSearchResults([{ word: searchQuery, pos: '名詞', meaning: '辞書データから該当する翻訳が見つかりませんでした。' }]);
      }
    } catch {
      setSearchResults([{ word: searchQuery, pos: '名詞', meaning: '辞書データから該当する翻訳が見つかりませんでした。' }]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddSearchedWord = async (wordObj) => {
    if (!selectedList) return;
    try {
      const updatedWords = [...(selectedList.words || []), wordObj];
      const updatedList = { ...selectedList, words: updatedWords };
      
      setSelectedList(updatedList);
      setVocabLists((prev) => prev.map((l) => (l.id === selectedList.id ? updatedList : l)));
      
      setSuccessMessage(`「${wordObj.word}」を単語帳に追加しました！`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('単語の追加に失敗しました。');
    }
  };

  const handleAiGenerateMoreWords = async () => {
    if (!selectedList) return;
    setGenerating(true);
    setError('');
    try {
      const authToken = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/ai-vocab/lists/${selectedList.id}/generate-more`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ amount: generateAmount }),
      });

      if (!response.ok) throw new Error('AI生成に失敗しました。');
      await fetchLists(userEmail);
      setSuccessMessage(`AIが新しく ${generateAmount} 個の単語を追加生成しました！`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      const mockWords = [
        { word: 'expansion', pos: '名詞', meaning: '拡大、拡張' },
        { word: 'strategy', pos: '名詞', meaning: '戦略、計画' }
      ];
      const updatedList = {
        ...selectedList,
        words: [...(selectedList.words || []), ...mockWords.slice(0, generateAmount)]
      };
      setSelectedList(updatedList);
      setVocabLists(prev => prev.map(l => l.id === selectedList.id ? updatedList : l));
      setSuccessMessage(`AI単語を追加しました（デモデータ反映）`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenQuizModal = () => {
    if (!selectedList?.words || selectedList.words.length === 0) {
      alert('クイズを行う単語がありません。');
      return;
    }
    setShowQuizCountModal(true);
  };

  const startQuizWithCount = (count) => {
    const allWords = selectedList.words;
    const targetCount = count === 'ALL' ? allWords.length : Math.min(count, allWords.length);
    setSelectedQuizCount(targetCount);
    setShowQuizCountModal(false);

    const targetWords = shuffleArray(allWords).slice(0, targetCount);

    const generatedQuestions = targetWords.map((wordObj) => {
      const otherMeanings = Array.from(
        new Set(
          allWords
            .filter((w) => w.meaning !== wordObj.meaning)
            .map((w) => w.meaning)
        )
      );

      let incorrects = shuffleArray(otherMeanings).slice(0, 3);
      const dummyPool = ['その他の意味', '該当なし', '別の定義', '文脈による意味'];
      let dummyIdx = 0;
      while (incorrects.length < 3) {
        const dummy = dummyPool[dummyIdx % dummyPool.length];
        if (!incorrects.includes(dummy)) {
          incorrects.push(dummy);
        }
        dummyIdx++;
      }

      const choices = shuffleArray([wordObj.meaning, ...incorrects]);
      return {
        word: wordObj.word,
        pos: wordObj.pos || '単語',
        correct: wordObj.meaning,
        choices: choices,
      };
    });

    setQuizQuestions(shuffleArray(generatedQuestions));
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setViewMode('quiz');
  };

  const handleSelectAnswer = (choice) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);
    if (choice === quizQuestions[currentQuizIdx].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuiz = () => {
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setViewMode('result');
    }
  };

  const coachContext = useMemo(() => {
    if (!selectedList) return '';
    const allWordsText = (selectedList.words || []).slice(0, 20).map(w => `${w.word}: ${w.meaning}`).join('\n');

    if (viewMode === 'quiz' && quizQuestions.length > 0) {
      const currentQ = quizQuestions[currentQuizIdx];
      return `現在のクイズ問題：${currentQ.word} (${currentQ.pos})\n正解の意味：${currentQ.correct}\n選択肢：${currentQ.choices.join(' / ')}\n\n単語帳の例:\n${allWordsText}`;
    }

    return `現在の単語帳：${selectedList.title} (${selectedList.level}レベル)\n\n単語一覧の例:\n${allWordsText}`;
  }, [viewMode, selectedList, quizQuestions, currentQuizIdx]);

  const submitCoachQuestion = async () => {
    if (!coachQuestion.trim()) {
      setCoachError('質問を入力してください。');
      return;
    }
    setCoachLoading(true);
    setCoachError('');
    setCoachAnswer('');

    try {
      const response = await fetch(`${API_BASE_URL}/ai/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: coachQuestion.trim(),
          context: coachContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || response.statusText);
      }

      const result = await response.json();
      setCoachAnswer(result.answer || 'AIからの応答がありませんでした。');
    } catch (err) {
      setCoachError(err instanceof Error ? err.message : 'AIへの問い合わせに失敗しました。');
    } finally {
      setCoachLoading(false);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedList(null); 
    setSearchResults([]);
    setSearchQuery('');
    setShowConsultantPanel(false);
  };

  const choiceLabels = ['A', 'B', 'C', 'D'];

  // --- 1️⃣ 詳細画面 (viewMode === 'detail') ---
  if (viewMode === 'detail' && selectedList) {
    return (
      <div className="ai-vocab-page">
        {/* メインコンテンツ（左側またはスマホ時の下側） */}
        <div className="ai-vocab-card main-content-card">
          <header className="ai-vocab-header">
            <div className="header-left">
              <h2>{selectedList.title}</h2>
              <p className="subtitle">{selectedList.level} レベル │ 合計 {selectedList.words?.length || 0} 単語</p>
            </div>
            <div className="reading-header-actions">
              {/* スマホ時のみ表示されるAIコーチトグルボタン */}
              <button className="ai-coach-button" onClick={() => setShowConsultantPanel(!showConsultantPanel)}>
                {showConsultantPanel ? '✕ AIコーチを閉じる' : '🤖 AIコーチ'}
              </button>
              {/* ご指定の通り「単語クイズ」へ変更 */}
              <button className="learning-quiz-skip-btn" onClick={handleOpenQuizModal}>単語クイズ 📝</button>
            </div>
          </header>

          <section className="ai-vocab-body">
            <div className="ai-generate-box">
              <h3>🤖 AIでさらに単語を自動追加する</h3>
              <p className="box-desc">現在のレベルに最適化された英単語をAIが自動で選定し、この単語帳に追加します。</p>
              <div className="generate-input-group">
                <div className="generate-select-wrapper">
                  <label>追加する単語数：</label>
                  <select value={generateAmount} onChange={(e) => setGenerateAmount(Number(e.target.value))}>
                    <option value={5}>5 単語追加</option>
                    <option value={10}>10 単語追加</option>
                    <option value={20}>20 単語追加</option>
                  </select>
                </div>
                <button className="btn-ai-generate" onClick={handleAiGenerateMoreWords} disabled={generating}>
                  {generating ? '✨ AI単語生成中...' : '✨ AIで単語を自動生成・追加'}
                </button>
              </div>
            </div>

            <div className="word-search-box">
              <h3>🔍 単語を検索して追加</h3>
              <div className="search-input-group">
                <input 
                  type="text" 
                  placeholder="意味を調べたい英単語を入力..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchWord()}
                />
                <button className="btn-primary search-btn" onClick={handleSearchWord} disabled={searching}>
                  {searching ? '検索中...' : '検索'}
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="search-results-simple">
                  {searchResults.map((r, i) => (
                    <div key={i} className="simple-result-item" style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center', margin: '8px 0' }}>
                      <div style={{ flex: 1 }}>
                        <strong>{r.word}</strong> <span className="word-pos">[{r.pos}]</span> : {r.meaning}
                      </div>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '12px' }}
                        onClick={() => handleAddSearchedWord(r)}
                      >
                        ＋ 単語帳に追加
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {successMessage && <div className="ai-vocab-success">{successMessage}</div>}
            {error && <div className="ai-vocab-error">{error}</div>}

            <div className="ai-vocab-words-detail">
              <h3>収録単語一覧</h3>
              {selectedList.words && selectedList.words.length > 0 ? (
                <div className="detail-word-grid">
                  {selectedList.words.map((word, index) => (
                    <div key={index} className="detail-word-card">
                      <div className="word-card-left">
                        <strong className="word-text">{word.word}</strong> 
                        <span className="word-pos">[{word.pos || '品詞'}]</span>
                      </div>
                      <div className="word-card-right">{word.meaning}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ai-vocab-no-words">この単語帳にはまだ単語がありません。</p>
              )}
            </div>
          </section>

          <footer className="ai-vocab-footer">
            <button className="btn-back" onClick={handleBackToList}>
              一覧に戻る
            </button>
          </footer>
        </div>

        {/* AIコーチパネル（PCは右側に常時表示・スマホ時は開いたときのみ最上段に配置） */}
        <div className={`reading-consultant-panel ${showConsultantPanel ? 'mobile-open' : 'mobile-closed'}`}>
          <div className="consultant-header">
            <div>
              <h3>AIコーチ</h3>
              <p>単語の覚え方や語源を質問してみましょう。</p>
            </div>
            {/* PC表示時はCSSで自動的に消えます */}
            <button className="consultant-close-btn" onClick={() => setShowConsultantPanel(false)}>閉じる</button>
          </div>
          <textarea
            className="consultant-textarea"
            placeholder="例：この中の単語で難しいのはどれですか？"
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

        {/* 出題数選択モーダル */}
        {showQuizCountModal && (
          <div className="cert-overlay">
            <div className="cert-modal animate-pop" style={{ maxWidth: '400px', padding: '32px 24px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '20px' }}>問題数を選んでください</h3>
              <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '14px' }}>
                サクッと確認したい場合は少ない問題数を選ぶことができます。
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <button className="choice-btn" onClick={() => startQuizWithCount(3)} style={{ justifyContent: 'center' }}>
                  ⚡ 3問だけサクッと挑戦
                </button>
                <button className="choice-btn" onClick={() => startQuizWithCount(5)} style={{ justifyContent: 'center' }}>
                  📝 5問挑戦（半分）
                </button>
                <button className="choice-btn" onClick={() => startQuizWithCount(10)} style={{ justifyContent: 'center' }}>
                  🎯 10問挑戦
                </button>
                <button className="choice-btn" onClick={() => startQuizWithCount('ALL')} style={{ justifyContent: 'center', borderColor: '#2563eb', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 'bold' }}>
                  🏆 全問 ({selectedList.words?.length || 0}問) 挑戦
                </button>
              </div>

              <button className="btn-secondary w-100" onClick={() => setShowQuizCountModal(false)}>
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- 2️⃣ クイズ画面 (viewMode === 'quiz') ---
  if (viewMode === 'quiz' && quizQuestions.length > 0) {
    const currentQuiz = quizQuestions[currentQuizIdx];

    return (
      <div className="ai-vocab-page">
        <div className="vocab-list-card reading-stage-card card-full-width main-content-card">
          <div className="screen-header reading-full-width">
            <span>AI単語テスト - クイズ ({currentQuizIdx + 1} / {quizQuestions.length})</span>
            <div className="reading-header-actions">
              <button className="ai-coach-button" onClick={() => setShowConsultantPanel(!showConsultantPanel)}>
                {showConsultantPanel ? '✕ AIコーチを閉じる' : '🤖 AIコーチ'}
              </button>
              <button className="exit-btn" onClick={() => setViewMode('detail')}>中断</button>
            </div>
          </div>

          <div className="quiz-container">
            <p className="quiz-question-label">正しい意味を選んでください：</p>
            <h2 className="quiz-word">
              {currentQuiz.word} <span className="quiz-word-pos">({currentQuiz.pos})</span>
            </h2>

            <div className="quiz-choices">
              {currentQuiz.choices.map((choice, i) => {
                let btnClass = 'choice-btn';
                if (isAnswered) {
                  if (choice === currentQuiz.correct) {
                    btnClass += ' correct-choice';
                  } else if (choice === selectedAnswer) {
                    btnClass += ' wrong-choice';
                  } else {
                    btnClass += ' disabled-choice';
                  }
                }
                return (
                  <button key={i} className={btnClass} onClick={() => handleSelectAnswer(choice)} disabled={isAnswered}>
                    <span className="choice-badge">{choiceLabels[i]}</span>
                    <span className="choice-text">{choice}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="quiz-feedback">
                {selectedAnswer === currentQuiz.correct ? (
                  <div className="feedback-badge correct">⭕ 正解！お見事です。</div>
                ) : (
                  <div className="feedback-badge wrong">
                    ❌ 不正解...（正解: <span className="feedback-correct-ans">{currentQuiz.correct}</span>）
                  </div>
                )}
                <button className="vocabulary-menu-primary-button w-100 next-quiz-btn" onClick={nextQuiz}>
                  {currentQuizIdx < quizQuestions.length - 1 ? '次の問題へ ➔' : 'テスト結果を見る ➔'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* クイズ画面でのAIコーチパネル */}
        <div className={`reading-consultant-panel ${showConsultantPanel ? 'mobile-open' : 'mobile-closed'}`}>
          <div className="consultant-header">
            <div>
              <h3>AIコーチ</h3>
              <p>クイズの単語について何でも質問してみましょう。</p>
            </div>
            <button className="consultant-close-btn" onClick={() => setShowConsultantPanel(false)}>閉じる</button>
          </div>
          <textarea
            className="consultant-textarea"
            placeholder="例：なぜこの選択肢が正解になるのですか？語源は？"
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
      </div>
    );
  }

  // --- 3️⃣ クイズ結果画面 (viewMode === 'result') ---
  if (viewMode === 'result') {
    return (
      <div className="ai-vocab-page">
        <div className="vocab-list-card text-center card-full-width">
          <h2 className="vocab-list-title" style={{ color: '#2563eb' }}>🎯 クイズ結果発表</h2>
          <p className="vocab-list-sub">{selectedList?.title} の確認テスト（全 {quizQuestions.length} 問）が終了しました。</p>

          <div className="result-score-box">
            <span className="result-score-num">{quizScore}</span> / {quizQuestions.length} 問正解
          </div>

          <button className="vocabulary-menu-primary-button" style={{ padding: '12px 32px' }} onClick={() => setViewMode('detail')}>
            単語帳に戻る
          </button>
        </div>
      </div>
    );
  }

  // --- 4️⃣ 一覧画面 (viewMode === 'list') ---
  return (
    <div className="ai-vocab-page">
      <div className="ai-vocab-card">
        <header className="ai-vocab-header">
          <div>
            <h2>AIパーソナル単語帳</h2>
            <p className="subtitle">AIでレベルに合った単語帳を自動生成し、あなた専用の学習リストを管理します。</p>
          </div>
        </header>

        <section className="ai-vocab-body">
          {(!isInitialized || (loading && !isCreating)) && (
            <div className="ai-vocab-loading">読み込み中...</div>
          )}

          {isInitialized && isCreating ? (
            <div className="ai-vocab-create-panel">
              <div className="create-panel-header">
                <h3>AI単語帳を作成</h3>
              </div>
              <div className="create-field">
                <label>単語帳タイトル</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="タイトルを入力" />
              </div>
              <div className="create-field">
                <label>学習レベル</label>
                <select value={selectedLevel} onChange={(e) => setSelectedLevel(Number(e.target.value))}>
                  <option value={450}>450 レベル</option>
                  <option value={600}>600 レベル</option>
                  <option value={730}>730 レベル</option>
                  <option value={860}>860 レベル</option>
                </select>
              </div>
              <div className="create-field">
                <label>初期生成する単語数</label>
                <input type="number" min="1" max="100" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
              <div className="create-actions">
                <button className="btn-primary" onClick={handleCreateList} disabled={loading}>
                  {loading ? '生成中...' : '単語帳を新規作成する'}
                </button>
              </div>
              {error && <div className="ai-vocab-error">{error}</div>}
            </div>
          ) : (
            isInitialized && !loading && (
              <>
                {vocabLists.length > 0 ? (
                  <div className="ai-vocab-list">
                    {vocabLists.map((list) => (
                      <article key={list.id} className="ai-vocab-list-item">
                        <div className="list-item-header">
                          <div>
                            <h3>{list.title}</h3>
                            <p>{list.level} レベル</p>
                          </div>
                          <span className="word-count">{(list.words && list.words.length) || 0} 単語</span>
                        </div>
                        <div className="list-item-meta">作成日: {list.created_at || '2026-07-08'}</div>
                        <button
                          type="button"
                          className="btn-secondary ai-vocab-expand-button"
                          onClick={() => {
                            setSelectedList(list);
                            setViewMode('detail');
                          }}
                        >
                          単語を見る
                        </button>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="ai-vocab-empty-state">
                    <p>まだAI単語帳がありません。</p>
                    <button className="btn-primary" onClick={() => setIsCreating(true)}>AI単語帳を作成する</button>
                  </div>
                )}

                {vocabLists.length > 0 && (
                  <div className="ai-vocab-actions">
                    <button className="btn-primary" onClick={() => setIsCreating(true)}>追加で単語帳を作成する</button>
                  </div>
                )}
                {error && <div className="ai-vocab-error">{error}</div>}
                {successMessage && <div className="ai-vocab-success">{successMessage}</div>}
              </>
            )
          )}
        </section>

        <footer className="ai-vocab-footer">
          <button className="btn-back" onClick={onBack}>戻る</button>
        </footer>
      </div>
    </div>
  );
}