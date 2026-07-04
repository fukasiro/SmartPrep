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
              <strong>450点レベル単語習得コース</strong>
              <div className="vocab-course-desc">基礎語彙を固め、TOEIC 450点レベルの語彙力を習得します。</div>
            </div>
            <button className="vocab-card-button">開始</button>
          </li>
          <li className="vocab-course-item">
            <div>
              <strong>600点レベル単語習得コース</strong>
              <div className="vocab-course-desc">600点突破に必要な語彙を中心に、実用的な例文とともに学習します。</div>
            </div>
            <button className="vocab-card-button">開始</button>
          </li>
          <li className="vocab-course-item">
            <div>
              <strong>730点レベル獲得コース</strong>
              <div className="vocab-course-desc">中級語彙を強化し、リーディング・リスニングの得点アップに直結する表現を習得します。</div>
            </div>
            <button className="vocab-card-button">開始</button>
          </li>
          <li className="vocab-course-item">
            <div>
              <strong>860点以上獲得コース</strong>
              <div className="vocab-course-desc">上級語彙を徹底演習し、860点以上を目指す語彙力を仕上げます。</div>
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
