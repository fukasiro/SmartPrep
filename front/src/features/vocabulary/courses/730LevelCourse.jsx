import React from 'react';
import '../VocabularyCourseList.css';

export default function Level730Course({ onBack }) {
  return (
    <div className="vocab-list-container">
      <div className="vocab-list-card">
        <h2 className="vocab-list-title">730点レベル獲得コース</h2>
        <p className="vocab-list-sub">中級語彙を強化し、リーディング・リスニングの得点アップに直結する表現を習得します。</p>

        <div className="vocab-course-detail">
          <p>このコースは、TOEIC 730点を狙うための中級語彙と定型表現をしっかり身につける構成です。</p>
          <ul className="vocab-course-features">
            <li>レベルアップに必要な中級語彙</li>
            <li>実践問題で語彙の応用力を強化</li>
            <li>解説付きの例文で理解を深める</li>
          </ul>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="vocabulary-menu-secondary-button" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}
