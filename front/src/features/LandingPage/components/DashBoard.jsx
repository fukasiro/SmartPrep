// front/src/features/auth/components/DashBoard.jsx
import React from 'react';
import './DashBoard.css';

export default function DashBoard({ onStartLearning }) {
  return (
    <main className="dashboard-content">
      <section className="dashboard-hero-card">
        <div className="dashboard-top">
          <div>
            <span className="dashboard-eyebrow">SmartPrep ダッシュボード</span>
            <h1 className="dashboard-title">学習成果を総合的に可視化</h1>
            <p className="dashboard-description">
              リーディング、リスニング、ライティングの成果を1つの画面で把握し、次に強化すべき学習をスマートに提案します。
            </p>
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
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h2>総合進捗のポイント</h2>
          <p>各セクションの最新成果を集約し、SmartPrep が優先すべき学習項目を提示します。</p>
          <ul>
            <li>リーディング: 語彙と速読をバランス強化</li>
            <li>リスニング: シャドーイングでリズムと聞き取り精度を改善</li>
            <li>ライティング: 構成と表現の磨き込みが次の一歩</li>
          </ul>
        </div>

        <div className="dashboard-card dashboard-action-card">
          <h2>次に取り組むべき学習</h2>
          <div className="dashboard-action-list">
            <div className="action-item">
              <div>
                <h3>速読チャレンジ</h3>
                <p>リーディングの精度を高め、速読力を鍛える。</p>
              </div>
              <button className="action-btn" onClick={onStartLearning}>開始</button>
            </div>
            <div className="action-item">
              <div>
                <h3>シャドーイング練習</h3>
                <p>リスニングの瞬発力と発音を同時に磨く。</p>
              </div>
              <button className="action-btn" onClick={onStartLearning}>開始</button>
            </div>
            <div className="action-item">
              <div>
                <h3>英文構成強化</h3>
                <p>ライティングの構成力を土台から強化する。</p>
              </div>
              <button className="action-btn" onClick={onStartLearning}>開始</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}