import React from 'react';
import './VocabularyMenu.css';

export default function VocabularyMenu({ onBack }) {
  return (
    <div className="vocabulary-menu-container">
      <div className="vocabulary-menu-card">
        <div className="vocabulary-menu-header">
          <h2>🧠 RT学習メニュー</h2>
          <p>単語学習を続けて、より速く正確な語彙定着を目指しましょう。</p>
        </div>
        <div className="vocabulary-menu-actions">
          <button className="vocabulary-menu-button">RT学習を始める</button>
          <button className="vocabulary-menu-secondary-button" onClick={onBack}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
