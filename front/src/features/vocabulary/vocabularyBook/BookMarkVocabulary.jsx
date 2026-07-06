import React, { useEffect, useState } from 'react';
import './BookMarkVocabulary.css';
import { loadBookmarkedWords, removeBookmarkedWord } from '../progressStorage';

export default function BookMarkVocabulary({ onBack }) {
  const [bookmarks, setBookmarks] = useState([]);

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

  return (
    <div className="bookmark-vocab-container">
      <div className="bookmark-vocab-card">
        <header className="bookmark-vocab-header">
          <h2>ブックマーク単語帳</h2>
          <p>登録した単語や自分で追加した単語をここで確認できます。</p>
        </header>

        <main className="bookmark-vocab-main">
          {bookmarks.length === 0 ? (
            <div className="bookmark-vocab-empty">
              <span className="bookmark-vocab-empty-icon">📚</span>
              <p>まだ単語が登録されていません。<br />単語コースでブックマークを追加してください。</p>
            </div>
          ) : (
            <ul className="bookmark-vocab-list">
              {bookmarks.map((item) => (
                <li key={item.word} className="bookmark-vocab-item">
                  <div className="bookmark-vocab-item-text">
                    <div className="bookmark-vocab-item-title-row">
                      <strong className="bookmark-vocab-word">{item.word}</strong>
                      {item.pos && <span className="bookmark-vocab-pos">{item.pos}</span>}
                    </div>
                    <p className="bookmark-vocab-meaning">{item.meaning}</p>
                  </div>
                  <button 
                    className="bookmark-vocab-remove-btn" 
                    onClick={() => handleRemove(item.word)}
                    aria-label={`${item.word}を削除`}
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>

        <footer className="bookmark-vocab-footer">
          {onBack && (
            <button className="bookmark-vocab-back-btn" onClick={onBack}>
              ← 戻る
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}