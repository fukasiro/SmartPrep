import React from 'react';
import './ReadingMenu.css';

// 開いた本のSVGアイコン (読解ヘッダー用)
const BookMarkedIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
    <path d="M6 2v20" />
    <path d="M10 2v8l3-2 3 2V2" />
  </svg>
);

// 開いた本 (問題コース用)
const BookOpenIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

// AIロボットアイコン (AIコーチ用)
const BotIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export default function ReadingMenu({ onBack, onStartCourse, onStartAiCoach }) {
  return (
    <div className="reading-menu-container">
      <div className="reading-menu-card">
        <div className="reading-menu-header">
          <h2>
            <span className="header-icon-wrapper">
              <BookMarkedIcon className="header-svg-icon" />
            </span>
            読解
          </h2>
          <p>長文読解に挑戦して、より速く正確なリーディング力の定着を目指しましょう。</p>
        </div>

        <div className="reading-menu-grid">
          {/* 左側：読解問題演習コース */}
          <div className="reading-section-card course-card">
            <div className="reading-card-icon">
              <BookOpenIcon className="card-svg-icon" />
            </div>
            <h3 className="reading-card-title">読解問題演習コース</h3>
            <p className="reading-card-description">
              TOEIC頻出パターンの長文問題に挑戦できるコースです。ビジネス文書からEメールまで、本番に近い形式で実戦力を鍛えます。
            </p>
            <button className="reading-card-button" onClick={onStartCourse}>コースを開始する</button>
          </div>

          {/* 右側：AIオリジナル読解コーチ */}
          <div className="reading-section-card ai-coach-card">
            <div className="reading-card-icon">
              <BotIcon className="card-svg-icon" />
            </div>
            <h3 className="reading-card-title">AIオリジナル読解コーチ</h3>
            <p className="reading-card-description">
              AIがあなたのレベルに合わせた長文をその場で生成。スラッシュリーディングや精読のフィードバックを個別に受けられます。
            </p>
            <button className="reading-card-button" onClick={onStartAiCoach}>コーチングを受ける</button>
          </div>
        </div>

        <div className="reading-menu-actions">
          <button className="reading-menu-secondary-button" onClick={onBack}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}