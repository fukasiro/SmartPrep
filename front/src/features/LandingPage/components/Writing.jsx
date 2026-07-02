// front/src/features/LandingPage/components/Writing.jsx
import React from 'react';
import './Writing.css';

export default function Writing() {
  const handleStartSection = (sectionName) => {
    console.log(`${sectionName} セクションを開始します`);
  };

  return (
    <div className="writing-container">
      <div className="writing-header">
        <h2 className="writing-main-title">✍️ ライティング学習ハブ</h2>
        <p className="writing-subtitle">
          表現力・構成力・正確さをバランスよく鍛え、TOEICライティングで説得力ある英文を作る力を育てます。
        </p>
      </div>

      <div className="writing-layout">
        <div className="writing-main-content">
          <div className="writing-grid">
            <div className="writing-card correction-card">
              <div className="card-icon-wrapper">📝</div>
              <h3 className="card-title">添削ライティング</h3>
              <p className="card-description">
                英文を入力するとAIが文法・語法・構成を細かく添削。弱点をその場で把握できます。
              </p>
              <button className="card-btn" onClick={() => handleStartSection('correction')}>
                添削を始める ✨
              </button>
            </div>

            <div className="writing-card summary-card">
              <div className="card-icon-wrapper">🧩</div>
              <h3 className="card-title">要約・再構築</h3>
              <p className="card-description">
                長文を短くまとめ、重要情報を正確に抽出する練習。論理的な英文構成力を強化します。
              </p>
              <button className="card-btn" onClick={() => handleStartSection('summary')}>
                要約練習を始める 🔍
              </button>
            </div>

            <div className="writing-card grammar-card">
              <div className="card-icon-wrapper">✒️</div>
              <h3 className="card-title">文法チェック＆表現改善</h3>
              <p className="card-description">
                提出前の文章をチェックし、より自然で明確な英語表現に改善します。
              </p>
              <button className="card-btn" onClick={() => handleStartSection('grammar')}>
                表現改善を試す 🔧
              </button>
            </div>
          </div>
        </div>

        <aside className="writing-side-panel">
          <div className="writing-side-card">
            <div className="side-card-header">
              <div>
                <h3>あなたのライティングスキル</h3>
                <p className="skill-summary-note">
                  英文の構成・文法・表現のバランスを可視化し、次に伸ばすべきポイントを示します。
                </p>
              </div>
              <span className="skill-summary-tag">論理的な英文力を強化</span>
            </div>

            <div className="skill-section">
              <div className="skill-row">
                <span>構成力</span>
                <strong>70%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress vocab-progress" style={{ width: '70%' }} />
              </div>
              <div className="skill-row">
                <span>文法力</span>
                <strong>75%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress reading-progress" style={{ width: '75%' }} />
              </div>
              <div className="skill-row">
                <span>語彙表現力</span>
                <strong>68%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress grammar-progress" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="course-section">
              <div className="recommended-header">
                <h3>おすすめのコース</h3>
                <span className="recommended-subtitle">次に取り組むべき学習</span>
              </div>
              <div className="course-list">
                <div className="course-item">
                  <div>
                    <h4>英文構成強化</h4>
                    <p>論理の流れを意識した構成力を鍛え、読み手に伝わる英語を作ります。</p>
                  </div>
                  <span className="course-badge">注目</span>
                </div>
                <div className="course-item">
                  <div>
                    <h4>語彙で魅せる英文</h4>
                    <p>自然で豊かな表現を学び、文書の説得力を高める練習。</p>
                  </div>
                  <span className="course-badge course-secondary">継続</span>
                </div>
                <div className="course-item">
                  <div>
                    <h4>TOEICライティング模擬</h4>
                    <p>実際の試験形式に近いライティング演習で本番力を磨きます。</p>
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
