// front/src/features/LandingPage/components/Reading.jsx
import React from 'react';
import './Reading.css';

export default function Reading({ onStartVocabulary, onStartReading }) {
  // 今後、各カードをクリックしたときに個別のアクションを起こせるようにハンドラを想定
  const handleStartSection = (sectionName) => {
    console.log(`${sectionName} セクションを開始します`);
    // ここに各学習画面への遷移ロジックを今後記述します
  };

  return (
    <div className="reading-container">
      {/* 上部ヘッダーセクション */}
      <div className="reading-header">
        <div className="reading-badge">Part 5 / 6 / 7</div>
        <h2 className="reading-main-title">📚 リーディング学習</h2>
        <p className="reading-subtitle">
          TOEICスコアの勝負所。語彙力、文法知識、そして長文読解力をバランスよく鍛え上げましょう。
        </p>
      </div>

      <div className="reading-layout">
        <div className="reading-main-content">
          {/* 💡 3つの独立したカードを並べるエリア */}
          <div className="reading-grid">
            <div className="reading-card vocab-card">
              <div className="card-icon-wrapper">📕</div>
              <h3 className="card-title">単語</h3>
              <p className="card-description">
                TOEIC頻出単語を厳選収録。AIがあなたの記憶の定着度に合わせて、間違えやすい単語を優先的に出題します。
              </p>
              <button className="card-btn" onClick={onStartVocabulary}>
                単語学習を始める
              </button>
            </div>

            <div className="reading-card reading-section-card">
              <div className="card-icon-wrapper">📖</div>
              <h3 className="card-title">読解セクション</h3>
              <p className="card-description">
                Part 6・7に対応した長文読解トレーニング。タイムマネジメントを意識しながら、素早く正確に情報を読み取る力を養います。
              </p>
              <button className="card-btn" onClick={onStartReading}>
                読解演習に挑む
              </button>
            </div>

            <div className="reading-card grammar-card">
              <div className="card-icon-wrapper">🧠</div>
              <h3 className="card-title">文法セクション</h3>
              <p className="card-description">
                Part 5の短文穴埋め問題で確実に満点を狙うためのセクション。品詞問題や時制など、TOEIC特有の文法パターンを網羅。
              </p>
              <button className="card-btn" onClick={() => handleStartSection('grammar')}>
                文法ノックを開始 📝
              </button>
            </div>
          </div>
        </div>

        <aside className="reading-side-panel">
          <div className="reading-side-card">
            <div className="side-card-header">
              <div>
                <h3>あなたのリーディングスキル</h3>
                <p className="skill-summary-note">
                  データに基づく推定スコア。次のおすすめコースで弱点を補強しましょう。
                </p>
              </div>
              <span className="skill-summary-tag">上級到達まであと一歩</span>
            </div>

            <div className="skill-section">
              <div className="skill-row">
                <span>語彙力</span>
                <strong>72%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress vocab-progress" style={{ width: '72%' }} />
              </div>
              <div className="skill-row">
                <span>読解力</span>
                <strong>65%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress reading-progress" style={{ width: '65%' }} />
              </div>
              <div className="skill-row">
                <span>文法力</span>
                <strong>80%</strong>
              </div>
              <div className="skill-bar">
                <div className="skill-progress grammar-progress" style={{ width: '80%' }} />
              </div>
            </div>

            <div className="course-section">
              <div className="recommended-header">
                <h3>おすすめのコース</h3>
                <span className="recommended-subtitle">今後の学習ロードマップ</span>
              </div>
              <div className="course-list">
                <div className="course-item">
                  <div>
                    <h4>速読チャレンジ</h4>
                    <p>Part 7の長文を時間内に正確に解く練習。</p>
                  </div>
                  <span className="course-badge">人気</span>
                </div>
                <div className="course-item">
                  <div>
                    <h4>文法クリニック</h4>
                    <p>Part 5の短文穴埋めを確実に解く基礎強化。</p>
                  </div>
                  <span className="course-badge course-secondary">継続</span>
                </div>
                <div className="course-item">
                  <div>
                    <h4>ボキャブラリー速習</h4>
                    <p>TOEIC頻出単語の苦手分野をAIで復習。</p>
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