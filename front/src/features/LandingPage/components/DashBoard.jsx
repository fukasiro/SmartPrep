// front/src/features/auth/components/DashBoard.jsx
import React from 'react';
import './DashBoard.css';

export default function DashBoard({ onStartLearning, onConsultantNavigate }) {
  // スコアのデータ（必要に応じて親コンポーネントからのPropsに変更してください）
  const readingScore = 350; // リーディング推定スコア
  const listeningScore = 300; // リスニング推定スコア
  const totalScore = readingScore + listeningScore; // 総合スコア (650)

  // 各セクションの満点（プログレスバーの割合計算用）
  const maxSectionScore = 495;

  // 満点に対する現在のスコアの割合（%）を計算
  const readingPercentage = Math.round((readingScore / maxSectionScore) * 100);
  const listeningPercentage = Math.round((listeningScore / maxSectionScore) * 100);

  return (
    <main className="dashboard-content">
      <section className="dashboard-main-grid">
        <div className="dashboard-hero-card">
          <div className="dashboard-top">
            <div>
              <span className="dashboard-eyebrow">SmartPrep ダッシュボード</span>
              <h1 className="dashboard-title">学習成果を総合的に可視化</h1>
              <p className="dashboard-description">
                リーディング、リスニングの成果を1つの画面で把握し、次に強化すべき学習をスマートに提案します。
              </p>
              <button
                className="consultant-action-button"
                onClick={onConsultantNavigate}
              >
                AIコンサルタントに相談する
              </button>
            </div>
            <div className="dashboard-summary-pill">
              <span>総合推定スコア</span>
              <strong>{totalScore}<span className="score-unit">点</span></strong>
            </div>
          </div>

          <div className="dashboard-metrics">
            <div className="metric-card metric-reading">
              <div className="metric-label">リーディング</div>
              <div className="metric-value">
                {readingScore}<span className="score-unit-sub"> / {maxSectionScore}点</span>
              </div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: `${readingPercentage}%` }} />
              </div>
            </div>
            <div className="metric-card metric-listening">
              <div className="metric-label">リスニング</div>
              <div className="metric-value">
                {listeningScore}<span className="score-unit-sub"> / {maxSectionScore}点</span>
              </div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: `${listeningPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}