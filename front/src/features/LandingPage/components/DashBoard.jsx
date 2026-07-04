// front/src/features/auth/components/DashBoard.jsx
import React from 'react';
import './DashBoard.css';

export default function DashBoard({ onStartLearning, onConsultantNavigate }) {
  return (
    <main className="dashboard-content">
      <section className="dashboard-main-grid">
        <div className="dashboard-hero-card">
          <div className="dashboard-top">
            <div>
              <span className="dashboard-eyebrow">SmartPrep ダッシュボード</span>
              <h1 className="dashboard-title">学習成果を総合的に可視化</h1>
              <p className="dashboard-description">
                リーディング、リスニング、ライティングの成果を1つの画面で把握し、次に強化すべき学習をスマートに提案します。
              </p>
              <button
                className="consultant-action-button"
                onClick={onConsultantNavigate}
              >
                AIコンサルタントに相談する
              </button>
            </div>
            <div className="dashboard-summary-pill">
              <span>総合達成率</span>
              <strong>72%</strong>
            </div>
          </div>

          <div className="dashboard-metrics">
            <div className="metric-card metric-reading">
              <div className="metric-label">リーディング</div>
              <div className="metric-value">78%</div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: '78%' }} />
              </div>
            </div>
            <div className="metric-card metric-listening">
              <div className="metric-label">リスニング</div>
              <div className="metric-value">71%</div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: '71%' }} />
              </div>
            </div>
            <div className="metric-card metric-writing">
              <div className="metric-label">ライティング</div>
              <div className="metric-value">68%</div>
              <div className="metric-progress">
                <div className="progress-bar" style={{ width: '68%' }} />
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}