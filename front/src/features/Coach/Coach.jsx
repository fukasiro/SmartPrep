import React from 'react';
import './Coach.css';

// 定義済みのSVGアイコン component
const TutorIcon = () => (
  <svg viewBox="0 0 24 24" className="coach-card-svg" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="10.5" cy="7" r="4" />
    <path d="M21 21v-2a2.5 2.5 0 0 0-2.5-2.5" />
    <circle cx="18.5" cy="11.5" r="2.5" />
  </svg>
);

const SchoolIcon = () => (
  <svg viewBox="0 0 24 24" className="coach-card-svg" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10L12 5 2 10l10 5 10-5z" />
    <path d="M6 12.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.5" />
    <path d="M22 10v6" />
  </svg>
);

export default function Coach({ onBack, onStartPrivateTutor, onStartSchoolSearch }) {
  return (
    <div className="coach-root">
      <div className="coach-header">
        {typeof onBack === 'function' && (
          <button className="coach-back" onClick={onBack} aria-label="戻る">
            ← 戻る
          </button>
        )}
        <h2>プロによる指導・学習プラン</h2>
        <p className="coach-sub">
          現在の課題や目標スコアに合わせて、最適な指導形態を選びましょう。
        </p>
      </div>

      <div className="coach-entrance">
        {/* 個人コーチ */}
        <div 
          className="coach-card" 
          role="button" 
          tabIndex={0} 
          onClick={onStartPrivateTutor} 
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onStartPrivateTutor?.()}
        >
          <div className="coach-card-badge">マンツーマン</div>
          <div className="coach-card-icon-wrapper">
            <TutorIcon />
          </div>
          <h3>専属パーソナルコーチ</h3>
          <p>あなたの弱点（Part 5の文法、Part 7の速読など）に特化した伴走型レッスン。</p>
          <ul className="coach-card-features">
            <li>目標スコアに合わせた柔軟なスケジュール</li>
            <li>日々の学習モチベーション管理</li>
          </ul>
          <div className="coach-card-action">
            <span>コーチを探す</span>
            <span className="coach-card-arrow">→</span>
          </div>
        </div>

        {/* 学習塾 */}
        <div 
          className="coach-card" 
          role="button" 
          tabIndex={0} 
          onClick={onStartSchoolSearch} 
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onStartSchoolSearch?.()}
        >
          <div className="coach-card-badge school">スクール・塾</div>
          <div className="coach-card-icon-wrapper">
            <SchoolIcon />
          </div>
          <h3>TOEIC対策スクール / 塾</h3>
          <p>体系的なカリキュラムと点数保証制度などで確実に結果を出すグループ・個別指導。</p>
          <ul className="coach-card-features">
            <li>短期集中の実績豊富な解法テクニック</li>
            <li>オンライン・対面の選択が可能</li>
          </ul>
          <div className="coach-card-action">
            <span>スクールを探す</span>
            <span className="coach-card-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
