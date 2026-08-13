import React from 'react';
import './Reading.css';

// --- SVG アイコンコンポーネント ---

// 左サイドメニューと同じ「開いた本」アイコン
const HeaderBookIcon = () => (
 <svg viewBox="0 0 24 24" className="menu-svg-icon" aria-hidden="true">
      <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11c1.38 0 2.5 1.12 2.5 2.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 20 4 18.88 4 17.5v-11Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6.5v11c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 7.5h7M8.5 10.5h7M8.5 13.5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 4.5v15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const VocabIcon = () => (
  <svg viewBox="0 0 24 24" className="card-svg-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ReadingIcon = () => (
  <svg viewBox="0 0 24 24" className="card-svg-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const GrammarIcon = () => (
  <svg viewBox="0 0 24 24" className="card-svg-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const FullTestIcon = () => (
  <svg viewBox="0 0 24 24" className="card-svg-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function Reading({ onStartVocabulary, onStartReading, onStartGrammar, onStartFullTest }) {
  const handleStartSection = (sectionName) => {
    console.log(`${sectionName} セクションを開始します`);
  };
  
  const handleStartVocabulary = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onStartVocabulary === 'function') {
      onStartVocabulary();
    } else {
      console.warn('onStartVocabulary not provided');
    }
  };
  
  const handleStartReading = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof onStartReading === 'function') {
      onStartReading();
    } else {
      console.warn('onStartReading not provided');
    }
  };

  return (
    <div className="reading-container">
      {/* ヘッダーセクション */}
      <div className="reading-header">
        <div className="reading-badge">Part 5 / 6 / 7</div>
        <h2 className="reading-main-title">
          <span className="reading-main-icon">
            <HeaderBookIcon />
          </span>
          リーディング学習
        </h2>
        <p className="reading-subtitle">
          TOEICスコアの勝負所。語彙力、文法知識、そして長文読解力をバランスよく鍛え上げましょう。
        </p>
      </div>

      <div className="reading-layout">
        <div className="reading-main-content">
          {/* 4つのカードグリッド */}
          <div className="reading-grid">
            {/* 単語 */}
            <div className="reading-card vocab-card">
              <div className="card-icon-wrapper">
                <VocabIcon />
              </div>
              <h3 className="card-title">単語</h3>
              <p className="card-description">
                TOEIC頻出単語を厳選収録。AIがあなたの記憶の定着度に合わせて、間違えやすい単語を優先的に出題します。
              </p>
              <button type="button" className="card-btn" onClick={handleStartVocabulary}>
                単語学習を始める
              </button>
            </div>

            {/* 読解セクション */}
            <div className="reading-card reading-section-card">
              <div className="card-icon-wrapper">
                <ReadingIcon />
              </div>
              <h3 className="card-title">読解セクション</h3>
              <p className="card-description">
                Part 6・7に対応した長文読解トレーニング。タイムマネジメントを意識しながら、素早く正確に情報を読み取る力を養います。
              </p>
              <button type="button" className="card-btn" onClick={handleStartReading}>
                読解演習に挑む
              </button>
            </div>

            {/* 文法セクション */}
            <div className="reading-card grammar-card">
              <div className="card-icon-wrapper">
                <GrammarIcon />
              </div>
              <h3 className="card-title">文法セクション</h3>
              <p className="card-description">
                Part 5の短文穴埋め問題で確実に満点を狙うためのセクション。品詞問題や時制など、TOEIC特有の文法パターンを網羅。
              </p>
              <button type="button" className="card-btn" onClick={(e) => { e.stopPropagation(); handleStartSection('grammar'); }}>
                文法学習を始める
              </button>
            </div>

            {/* リーディング総合テスト */}
            <div className="reading-card fulltest-card">
              <div className="card-icon-wrapper fulltest-icon">
                <FullTestIcon />
              </div>
              <h3 className="card-title">リーディング総合テスト</h3>
              <p className="card-description">
                Part 5〜7を制限時間（75分）で通しで解く実践演習。本番さながらの環境でスコアと解法スピードを測定します。
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