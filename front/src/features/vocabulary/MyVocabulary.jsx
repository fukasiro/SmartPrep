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
              <span className="voca-title-icon">🧠</span> My単語帳
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
            <div className="card-icon-box">📚</div>
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
            <div className="card-icon-box">✨</div>
            <h3 className="card-title">AIパーソナル単語帳</h3>
            <p className="card-description">
              AIがあなたの学習傾向や弱点を分析し、あなただけに最適化された専用の単語帳をカスタマイズ生成します。
            </p>
            <button 
              className="btn-action"
              onClick={() => onSelect?.('ai-personal')}
            >
              AI単語帳を開く
            </button>
          </div>

        </div>

        {/* フッターエリア（スクショに合わせた左下の戻るボタン） */}
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