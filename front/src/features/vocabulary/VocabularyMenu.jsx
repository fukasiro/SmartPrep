import React from 'react';
import './VocabularyMenu.css';

// 語彙・単語ヘッダー用アイコン (A-Z ブックマーク風)
const VocabularyIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M8 7h6" />
    <path d="M8 11h8" />
    <path d="M8 15h5" />
  </svg>
);

// 単語学習コース用アイコン (本)
const BookOpenIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

// My単語帳用アイコン (フォルダ・カードインデックス)
const FolderIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L8.6 3.3A2 2 0 0 0 6.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    <path d="M2 10h20" />
  </svg>
);

export default function VocabularyMenu({ onBack, onStartCourse, onStartMyVocabulary }) {
  return (
    <div className="vocabulary-menu-container">
      <div className="vocabulary-menu-card">
        <div className="vocabulary-menu-header">
          <h2>
            <span className="header-icon-wrapper">
              <VocabularyIcon className="header-svg-icon" />
            </span>
            単語
          </h2>
          <p>単語学習を続けて、より速く正確な語彙定着を目指しましょう。</p>
        </div>

        <div className="vocabulary-menu-grid">
          <div className="vocab-card vocab-course-card">
            <div className="vocab-card-icon">
              <BookOpenIcon className="card-svg-icon" />
            </div>
            <h3 className="vocab-card-title">単語学習コース</h3>
            <p className="vocab-card-description">
              TOEIC頻出語彙を効率よく学べるコースです。出題形式を切り替えて苦手語彙を重点的に強化します。
            </p>
            <button className="vocab-card-button" onClick={onStartCourse}>コースを開始する</button>
          </div>

          <div className="vocab-card my-vocab-card">
            <div className="vocab-card-icon">
              <FolderIcon className="card-svg-icon" />
            </div>
            <h3 className="vocab-card-title">My単語帳</h3>
            <p className="vocab-card-description">
              あなたが登録した単語とテスト履歴を一括管理。復習すべき単語をすぐに取り出せます。
            </p>
            <button className="vocab-card-button" onClick={onStartMyVocabulary}>単語帳を開く</button>
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