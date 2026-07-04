import React from 'react';
import './860LevelCourse.css';

export default function Level860Course({ onBack }) {
  return (
    <div className="vocab-list-container">
      <div className="vocab-list-card">
        <h2 className="vocab-list-title">860点以上獲得コース</h2>
        <p className="vocab-list-sub">上級語彙を徹底演習し、860点以上を目指す語彙力を仕上げます。</p>

        <div className="vocab-course-detail">
          <p>このコースでは、上級語彙と高度な表現を集中して学び、実戦形式の問題で本番力を強化します。</p>
          <ul className="vocab-course-features">
            <li>860点以上を目指す上級語彙</li>
            <li>論理的な語彙使い分けのトレーニング</li>
            <li>実践問題で完成度を高める</li>
          </ul>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="vocabulary-menu-secondary-button" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}
