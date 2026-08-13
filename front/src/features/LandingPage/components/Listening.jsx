import React from 'react';
import './Listening.css';

// --- SVG アイコンコンポーネント ---
const HeadphonesIcon = () => (
  <svg viewBox="0 0 24 24" className="card-svg-icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const ShadowingIcon = () => (
  <svg viewBox="0 0 24 24" className="card-svg-icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
);

const FullTestIcon = () => (
  <svg viewBox="0 0 24 24" className="card-svg-icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function Listening({ onStartShadowing, onStartListening, onStartFullTest }) {
  const handleStartSection = (sectionName) => {
    console.log(`${sectionName} セクションを開始します`);
  };

  return (
    <div className="listening-container">
      {/* ヘッダーセクション */}
      <div className="listening-header">
        <div className="listening-badge">Part 1 / 2 / 3 / 4</div>
        <h2 className="listening-main-title">
          <span className="listening-main-icon">
            <HeadphonesIcon />
          </span>
          リスニング学習
        </h2>
        <p className="listening-subtitle">
          聞き取りの正確さとスピーキングの再現力を同時に鍛え、TOEICの音声問題に最短で慣れましょう。
        </p>
      </div>

      <div className="listening-layout">
        <div className="listening-main-content">
          {/* 3つのカードグリッド */}
          <div className="listening-grid">
            {/* シャドーイング */}
            <div className="listening-card shadowing-card">
              <div className="card-icon-wrapper">
                <ShadowingIcon />
              </div>
              <h3 className="card-title">シャドーイング</h3>
              <p className="card-description">
                音声を聞きながら瞬時に声を出して追いかける訓練。発音・リズム・イントネーションを体で覚えます。
              </p>
              <button 
                className="card-btn" 
                onClick={onStartShadowing || (() => handleStartSection('shadowing'))}
              >
                シャドーイングを始める
              </button>
            </div>

            {/* リスニング演習 */}
            <div className="listening-card listening-section-card">
              <div className="card-icon-wrapper">
                <HeadphonesIcon />
              </div>
              <h3 className="card-title">リスニング</h3>
              <p className="card-description">
                TOEIC音声問題に合わせたリスニング演習。ディテールの聞き取りと意図把握を同時に強化します。
              </p>
              <button 
                className="card-btn" 
                onClick={onStartListening || (() => handleStartSection('listening'))}
              >
                リスニング練習を開始
              </button>
            </div>

            {/* 追加：リスニング総合テスト */}
            <div className="listening-card fulltest-card">
              <div className="card-icon-wrapper fulltest-icon">
                <FullTestIcon />
              </div>
              <h3 className="card-title">リスニング総合テスト</h3>
              <p className="card-description">
                Part 1〜4を通しで解く（45分間・100問）実践模試。本番に近い音声スピードと連続解答で集中力を鍛えます。
              </p>
              <button 
                className="card-btn primary-btn" 
                onClick={onStartFullTest || (() => handleStartSection('fulltest'))}
              >
                模擬テストに挑戦
              </button>
            </div>
          </div>
        </div>

        {/* サイドパネル */}
        <aside className="listening-side-panel">
          <div className="listening-side-card">
            <div className="side-card-header">
              <div>
                <h3>あなたのリスニングスキル</h3>
                <p className="skill-summary-note">
                  現状の理解度を可視化し、次に必要な練習をリストで示します。
                </p>
              </div>
              <span className="skill-summary-tag">聞き取り力を早く伸ばそう</span>
            </div>

            <div className="skill-section">
              <div className="skill-row">
                <span>語彙聴解</span>
                <strong>68%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress vocab-progress" style={{ width: '68%' }} />
              </div>
              <div className="skill-row">
                <span>瞬間リピート</span>
                <strong>62%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress reading-progress" style={{ width: '62%' }} />
              </div>
              <div className="skill-row">
                <span>総合理解</span>
                <strong>74%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress grammar-progress" style={{ width: '74%' }} />
              </div>
            </div>

            <div className="course-section">
              <div className="recommended-header">
                <h3>おすすめのコース</h3>
                <span className="recommended-subtitle">今すぐ強化したい項目</span>
              </div>
              <div className="course-list">
                <div className="course-item">
                  <div>
                    <h4>シャドーイング集中プラン</h4>
                    <p>発音とリズムを同時に強化し、スムーズな音声追走を目指します。</p>
                  </div>
                  <span className="course-badge">注目</span>
                </div>
                <div className="course-item">
                  <div>
                    <h4>Part 2 集中リスニング</h4>
                    <p>短い会話の正確な聞き取り力を上げる演習。</p>
                  </div>
                  <span className="course-badge course-secondary">継続</span>
                </div>
                <div className="course-item">
                  <div>
                    <h4>スピードディクテーション</h4>
                    <p>音声を聞き取って入力することでディテールの精度を高めます。</p>
                  </div>
                  <span className="course-badge course-tertiary">新着</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}