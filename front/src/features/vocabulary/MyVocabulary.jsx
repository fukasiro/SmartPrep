import React from 'react';
import './MyVocabulary.css';

export default function MyVocabulary({ onSelect, onBack }) {
  return (
    <div className="voca-container">
      <div className="voca-card">
        {/* ヘッダーエリア */}
        <header className="voca-header">
          <div className="voca-header-left">
            <h2 className="voca-title">
              <span className="voca-title-icon">
                {/* 脳/学習イメージのSVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                  <path d="M15 13a3 3 0 1 0-6 0"/>
                  <path d="M12 5v13"/>
                </svg>
              </span> 
              My単語帳
            </h2>
            <p className="voca-subtitle">
              単語学習を続けて、より速く正確な語彙定着を目指しましょう。
            </p>
          </div>
        </header>

        {/* 2つの入り口（メニュー選択エリア） */}
        <div className="voca-menu-grid">
          
          {/* 入り口1：ブックマーク＆自分で追加する単語帳 */}
          <div className="menu-entrance-card">
            <div className="card-icon-box">
              {/* ブックマーク/本イメージのSVG */}
              <svg className="card-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              </svg>
            </div>
            <h3 className="card-title">ブックマーク & 手動追加単語帳</h3>
            <p className="card-description">
              登録したお気に入りの単語や、自分で新しく追加した単語を一覧でチェック・管理して復習できます。
            </p>
            <button 
              className="btn-action"
              onClick={() => onSelect?.('bookmark-custom')}
            >
              単語帳を開く
            </button>
          </div>

          {/* 入り口2：AIパーソナル単語帳 */}
          <div className="menu-entrance-card">
            <div className="card-icon-box ai-icon-box">
              {/* AI/キラキラツールのSVG */}
              <svg className="card-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                <path d="M5 3v4"/>
                <path d="M19 17v4"/>
                <path d="M3 5h4"/>
                <path d="M17 19h4"/>
              </svg>
            </div>
            <h3 className="card-title">AIパーソナル単語帳</h3>
            <p className="card-description">
              AIがあなたの学習傾向や弱点を分析し、あなただけに最適化された専用の単語帳をカスタマイズ生成します。
            </p>
            <button 
              className="btn-action btn-ai-action"
              onClick={() => onSelect?.('ai-personal')}
            >
              AI単語帳を開く
            </button>
          </div>

        </div>

        {/* フッターエリア */}
        <footer className="voca-footer">
          {onBack && (
            <button className="btn-back" onClick={onBack}>
              戻る
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}