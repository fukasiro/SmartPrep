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
    removeBookmarkedWord(word);
    syncBookmarks();
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
            <p className="bookmark-vocab-empty">まだ単語が登録されていません。単語コースでブックマークを追加してください。</p>
          ) : (
            <ul className="bookmark-vocab-list">
              {bookmarks.map((item) => (
                <li key={item.word} className="bookmark-vocab-item">
                  <div className="bookmark-vocab-item-text">
                    <strong>{item.word}</strong>
                    <span>{item.pos}</span>
                    <p>{item.meaning}</p>
                  </div>
                  <button className="bookmark-vocab-remove-btn" onClick={() => handleRemove(item.word)}>
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
              戻る
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
