import React from 'react';
import './ReadingCourseList.css';

export default function ReadingCourseList({ onBack, onStart450, onStart600, onStart730, onStart860 }) {
  return (
    <div className="vocab-list-container">
      <div className="vocab-list-card">
        <h2 className="vocab-list-title">読解コース一覧</h2>
        <p className="vocab-list-sub">利用可能な読解学習コースを選んでください。</p>

        <ul className="vocab-courses">
          <li className="vocab-course-item">
            <div>
              <strong>TOEIC450レベル読解コース</strong>
              <div className="vocab-course-desc">基礎的な長文読解スキルを習得し、Part 6・7の基本パターンを学びます。</div>
            </div>
            <button className="vocab-card-button" onClick={onStart450}>開始</button>
          </li>
          <li className="vocab-course-item">
            <div>
              <strong>TOEIC600レベル読解コース</strong>
              <div className="vocab-course-desc">ビジネス文書やメールなど、実践的な長文問題に挑戦します。</div>
            </div>
            <button className="vocab-card-button" onClick={onStart600}>開始</button>
          </li>
          <li className="vocab-course-item">
            <div>
              <strong>TOEIC730レベル読解コース</strong>
              <div className="vocab-course-desc">複雑な文構造や表現に対応した高度な読解訓練を行います。</div>
            </div>
            <button className="vocab-card-button" onClick={onStart730}>開始</button>
          </li>
          <li className="vocab-course-item">
            <div>
              <strong>TOEIC860レベル読解コース</strong>
              <div className="vocab-course-desc">高速読解と深い理解を両立させ、満点を目指す訓練を行います。</div>
            </div>
            <button className="vocab-card-button" onClick={onStart860}>開始</button>
          </li>
        </ul>

        <div style={{ marginTop: 20 }}>
          <button className="vocabulary-menu-secondary-button" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}
