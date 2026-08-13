import React from 'react';
import './ReadingCourseList.css';

// 読解コース一覧用ヘッダーアイコン（本 ＋ メガネ）
const ReadingCourseIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1.5-5-1.5S2 20 2 20V6z" />
    <path d="M12 6s1.5-2 5-2 5 2 5 2v14s-1.5-1.5-5-1.5-5 1.5-5 1.5V6z" />
    <circle cx="6" cy="11" r="2" />
    <circle cx="18" cy="11" r="2" />
    <path d="M8 11h8" />
  </svg>
);

export default function ReadingCourseList({ 
  onBack, 
  onStart450, 
  onStart600, 
  onStart730, 
  onStart860 
}) {
  return (
    <div className="rcl-container">
      <div className="rcl-card">
        <div className="rcl-header">
          <h2>
            <span className="header-icon-wrapper">
              <ReadingCourseIcon className="header-svg-icon" />
            </span>
            読解コース一覧
          </h2>
          <p className="rcl-sub">利用可能な読解学習コースを選んでください。</p>
        </div>

        <ul className="rcl-courses">
          <li className="rcl-course-item">
            <div className="rcl-course-info">
              <strong>TOEIC450レベル読解コース</strong>
              <div className="rcl-course-desc">基礎的な長文読解スキルを習得し、Part 6・7の基本パターンを学びます。</div>
            </div>
            <button className="rcl-start-button" onClick={onStart450}>開始</button>
          </li>

          <li className="rcl-course-item">
            <div className="rcl-course-info">
              <strong>TOEIC600レベル読解コース</strong>
              <div className="rcl-course-desc">ビジネス文書やメールなど、実践的な長文問題に挑戦します。</div>
            </div>
            <button className="rcl-start-button" onClick={onStart600}>開始</button>
          </li>

          <li className="rcl-course-item">
            <div className="rcl-course-info">
              <strong>TOEIC730レベル読解コース</strong>
              <div className="rcl-course-desc">複雑な文構造や表現に対応した高度な読解訓練を行います。</div>
            </div>
            <button className="rcl-start-button" onClick={onStart730}>開始</button>
          </li>

          <li className="rcl-course-item">
            <div className="rcl-course-info">
              <strong>TOEIC860レベル読解コース</strong>
              <div className="rcl-course-desc">高速読解と深い理解を両立させ、満点を目指す訓練を行います。</div>
            </div>
            <button className="rcl-start-button" onClick={onStart860}>開始</button>
          </li>
        </ul>

        <div className="rcl-actions">
          <button className="rcl-secondary-button" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}