import React from 'react';
import '../VocabularyCourseList.css';

export default function Level600Course({ onBack }) {
  return (
    <div className="vocab-list-container">
      <div className="vocab-list-card">
        <h2 className="vocab-list-title">600点レベル単語習得コース</h2>
        <p className="vocab-list-sub">600点突破に必要な語彙を中心に、実用的な例文とともに学習します。</p>

        <div className="vocab-course-detail">
          <p>このコースでは、頻出表現を使った例文とともに単語を学び、文脈での理解を深めます。</p>
          <ul className="vocab-course-features">
            <li>600点レベルの重要語彙</li>
            <li>類語・対義語のペアで語彙を整理</li>
            <li>練習問題で記憶を定着</li>
          </ul>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="vocabulary-menu-secondary-button" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}
