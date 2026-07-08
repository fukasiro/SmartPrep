import { useEffect, useState, useCallback } from 'react';
import './AiVocabulary.css';

const API_BASE_URL = 'http://127.0.0.1:8000';
const DEFAULT_VOCAB_LISTS = [];
const LEVEL_OPTIONS = [450, 600, 730, 860];

export default function AiVocabulary({ onBack, userEmail: propUserEmail }) {
  const [vocabLists, setVocabLists] = useState(DEFAULT_VOCAB_LISTS);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(450);
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedListId, setExpandedListId] = useState(null);

  const [userEmail, setUserEmail] = useState(propUserEmail || '');
  const [isInitialized, setIsInitialized] = useState(false); 

  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('eng_learning_access_token');
  };

  // 1. マウント時に localStorage から認証情報を同期
  useEffect(() => {
    let localMail = 'なし';
    let tokenStatus = 'なし';
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('eng_learning_user');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          localMail = parsed?.email || 'オブジェクト内にemailなし';
          if (parsed?.email) setUserEmail(parsed.email);
        } catch (e) {
          localMail = 'JSONパース失敗';
        }
      }
      const token = getAuthToken();
      tokenStatus = token ? 'あり' : 'なし';
    }

    if (propUserEmail) {
      setUserEmail(propUserEmail);
    }

    setIsInitialized(true);
  }, [propUserEmail]);

  // 2. データフェッチ関数（安全にメールアドレスで一覧を取得）
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

      if (!response.ok) {
        throw new Error(`サーバーエラーが発生しました (Status: ${response.status})`);
      }
      const data = await response.json();
      setVocabLists(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : '読み込み中にエラーが発生しました。';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. 初期化完了を待ってからフェッチ判定
  useEffect(() => {
    if (!isInitialized) return; 

    if (!userEmail) {
      setError('ログインしてAI単語帳を管理してください。');
      setLoading(false);
      return;
    }

    fetchLists(userEmail);
  }, [isInitialized, userEmail, fetchLists]);

  const handleOpenCreate = () => {
    setIsCreating(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setError('');
    setSuccessMessage('');
  };

  const handleCreateList = async () => {
    if (!userEmail) {
      setError('ログインしてからAI単語帳を作成してください。');
      return;
    }
    if (amount <= 0 || amount > 100) {
      setError('作成する単語数は1〜100の間で指定してください。');
      return;
    }

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
      if (!response.ok) {
        throw new Error(result.detail || 'AI単語帳の作成に失敗しました。');
      }

      setVocabLists((prevLists) => [result, ...prevLists]);
      setExpandedListId(result.id);
      setIsCreating(false);
      setNewTitle('');
      setAmount(10);
      setSuccessMessage('AI単語帳を作成しました。');
    } catch (err) {
      const message = err instanceof Error ? err.message : '単語帳の作成中にエラーが発生しました。';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-vocab-page">
      {/* 🛠️ デバッグ表示用パネル */}
      <div className="ai-vocab-card">
        <header className="ai-vocab-header">
          <div>
            <h2>AIパーソナル単語帳</h2>
            <p>AIでレベルに合った単語帳を自動生成し、あなた専用の学習リストを管理します。</p>
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
                <p>学習レベルと単語数を指定して、AI単語帳を生成します。</p>
              </div>

              <div className="create-field">
                <label>単語帳タイトル</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="タイトルを入力（省略可）"
                />
              </div>

              <div className="create-field">
                <label>学習レベル</label>
                <select value={selectedLevel} onChange={(e) => setSelectedLevel(Number(e.target.value))}>
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>{`${level} レベル`}</option>
                  ))}
                </select>
              </div>

              <div className="create-field">
                <label>追加する単語数</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>

              <div className="create-actions">
                <button className="btn-primary" onClick={handleCreateList} disabled={loading}>
                  {loading ? '作成中...' : '単語帳を作成する'}
                </button>
                <button className="btn-secondary" onClick={handleCancelCreate} disabled={loading}>
                  キャンセル
                </button>
              </div>

              {error && <div className="ai-vocab-error">{error}</div>}
              {successMessage && <div className="ai-vocab-success">{successMessage}</div>}
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
                            <p>{list.level} レベル {list.words_count} 単語</p>
                          </div>
                          <span className="word-count">{list.words_count} 単語</span>
                        </div>
                        <div className="list-item-meta">作成日: {list.created_at}</div>
                        <button
                          type="button"
                          className="btn-secondary ai-vocab-expand-button"
                          onClick={() => setExpandedListId(expandedListId === list.id ? null : list.id)}
                        >
                          {expandedListId === list.id ? '単語を閉じる' : '単語を見る'}
                        </button>
                        {expandedListId === list.id && (
                          <div className="ai-vocab-words">
                            {list.words && list.words.length > 0 ? (
                              <ul>
                                {list.words.map((word, index) => (
                                  <li key={`${list.id}-${index}`} className="ai-vocab-word-item">
                                    <strong>{word.word}</strong> <span className="word-pos">[{word.pos || '品詞不明'}]</span>
                                    <div className="word-meaning">{word.meaning}</div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="ai-vocab-no-words">この単語帳にはまだ単語がありません。</p>
                            )}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="ai-vocab-empty-state">
                    <p>まだAI単語帳がありません。AI単語帳を作成して、ここに追加しましょう。</p>
                    <button className="btn-primary" onClick={handleOpenCreate}>
                      AI単語帳を作成する
                    </button>
                  </div>
                )}

                {vocabLists.length > 0 && (
                  <div className="ai-vocab-actions">
                    <button className="btn-primary" onClick={handleOpenCreate}>
                      追加で単語帳を作成する
                    </button>
                  </div>
                )}

                {error && !isCreating && <div className="ai-vocab-error">{error}</div>}
                {successMessage && !isCreating && <div className="ai-vocab-success">{successMessage}</div>}
              </>
            )
          )}
        </section>

        <footer className="ai-vocab-footer">
          <button className="btn-back" onClick={onBack}>
            戻る
          </button>
        </footer>
      </div>
    </div>
  );
}