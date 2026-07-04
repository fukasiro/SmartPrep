import React from 'react';
import './VocabularyMenu.css';

export default function VocabularyMenu({ onBack, onStartCourse }) {
  return (
    <div className="vocabulary-menu-container">
      <div className="vocabulary-menu-card">
        <div className="vocabulary-menu-header">
          <h2>🧠 RT学習メニュー</h2>
          <p>単語学習を続けて、より速く正確な語彙定着を目指しましょう。</p>
        </div>

        <div className="vocabulary-menu-grid">
          <div className="vocab-card vocab-course-card">
            <div className="vocab-card-icon">📚</div>
            <h3 className="vocab-card-title">単語学習コース</h3>
            <p className="vocab-card-description">
              TOEIC頻出語彙を効率よく学べるコースです。出題形式を切り替えて苦手語彙を重点的に強化します。
            </p>
            <button className="vocab-card-button" onClick={onStartCourse}>コースを開始する</button>
          </div>

          <div className="vocab-card my-vocab-card">
            <div className="vocab-card-icon">🗂️</div>
            <h3 className="vocab-card-title">My単語帳</h3>
            <p className="vocab-card-description">
              あなたが登録した単語とテスト履歴を一括管理。復習すべき単語をすぐに取り出せます。
            </p>
            <button className="vocab-card-button">単語帳を開く</button>
          </div>
        </div>

        <div className="vocabulary-menu-actions">
          <button className="vocabulary-menu-secondary-button" onClick={onBack}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
