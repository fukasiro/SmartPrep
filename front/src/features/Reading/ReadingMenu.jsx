import React from 'react';
import './ReadingMenu.css';

export default function ReadingMenu({ onBack, onStartCourse, onStartAiCoach }) {
  return (
    <div className="reading-menu-container">
      <div className="reading-menu-card">
        <div className="reading-menu-header">
          <h2>🧠 読解</h2>
          <p>長文読解に挑戦して、より速く正確なリーディング力の定着を目指しましょう。</p>
        </div>

        <div className="reading-menu-grid">
          {/* 左側：読解問題演習コース */}
          <div className="reading-section-card course-card">
            <div className="reading-card-icon">📚</div>
            <h3 className="reading-card-title">読解問題演習コース</h3>
            <p className="reading-card-description">
              TOEIC頻出パターンの長文問題に挑戦できるコースです。ビジネス文書からEメールまで、本番に近い形式で実戦力を鍛えます。
            </p>
            <button className="reading-card-button" onClick={onStartCourse}>コースを開始する</button>
          </div>

          {/* 右側：AIオリジナル読解コーチ */}
          <div className="reading-section-card ai-coach-card">
            <div className="reading-card-icon">🤖</div>
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