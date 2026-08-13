import React from 'react';
import './VocabularyCourseList.css';

// コースリスト用ヘッダーアイコン
const CourseListIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M8 7h6" />
    <path d="M8 11h8" />
  </svg>
);

export default function VocabularyCourseList({ onBack, onStart450, onStart600, onStart730, onStart860 }) {
  return (
    <div className="vocab-list-container">
      <div className="vocab-list-card">
        <div className="vocab-list-header">
          <h2>
            <span className="header-icon-wrapper">
              <CourseListIcon className="header-svg-icon" />
            </span>
            単語コース一覧
          </h2>
          <p className="vocab-list-sub">利用可能な単語学習コースを選んでください。</p>
        </div>

        <ul className="vocab-courses">
          <li className="vocab-course-item">
            <div className="vocab-course-info">
              <strong>450点レベル単語習得コース</strong>
              <div className="vocab-course-desc">基礎語彙を固め、TOEIC 450点レベルの語彙力を習得します。</div>
            </div>
            <button className="vcl-start-button" onClick={onStart450}>開始</button>
          </li>

          <li className="vocab-course-item">
            <div className="vocab-course-info">
              <strong>600点レベル単語習得コース</strong>
              <div className="vocab-course-desc">600点突破に必要な語彙を中心に、実用的な例文とともに学習します。</div>
            </div>
            <button className="vcl-start-button" onClick={onStart600}>開始</button>
          </li>

          <li className="vocab-course-item">
            <div className="vocab-course-info">
              <strong>730点レベル獲得コース</strong>
              <div className="vocab-course-desc">中級語彙を強化し、リーディング・リスニングの得点アップに直結する表現を習得します。</div>
            </div>
            <button className="vcl-start-button" onClick={onStart730}>開始</button>
          </li>

          <li className="vocab-course-item">
            <div className="vocab-course-info">
              <strong>860点以上獲得コース</strong>
              <div className="vocab-course-desc">上級語彙を徹底演習し、860点以上を目指す語彙力を仕上げます。</div>
            </div>
            <button className="vcl-start-button" onClick={onStart860}>開始</button>
          </li>
        </ul>

        <div className="vocab-list-actions">
          <button className="vcl-secondary-button" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}