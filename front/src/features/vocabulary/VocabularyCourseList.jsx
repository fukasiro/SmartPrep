import React from 'react';
import './VocabularyCourseList.css';

export default function VocabularyCourseList({ onBack }) {
  return (
    <div className="vocab-list-container">
      <div className="vocab-list-card">
        <h2 className="vocab-list-title">単語コース一覧</h2>
        <p className="vocab-list-sub">利用可能な単語学習コースを選んでください。</p>

        <ul className="vocab-courses">
          <li className="vocab-course-item">
            <div>
              <strong>TOEIC頻出語彙コース</strong>
              <div className="vocab-course-desc">出題形式を切り替えて苦手語彙を強化します。</div>
            </div>
            <button className="vocab-card-button">開始</button>
          </li>
        </ul>

        <div style={{ marginTop: 20 }}>
          <button className="vocabulary-menu-secondary-button" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}
