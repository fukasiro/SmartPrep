// front/src/features/LandingPage/components/Reading.jsx
import React from 'react';
import './Reading.css';

export default function Reading() {
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
        <h2 className="reading-main-title">📚 リーディング学習ハブ</h2>
        <p className="reading-subtitle">
          TOEICスコアの勝負所。語彙力、文法知識、そして長文読解力をバランスよく鍛え上げましょう。
        </p>
      </div>

      {/* 💡 3つの独立したカードを並べるエリア */}
      <div className="reading-grid">
        
        {/* カード1：単語帳機能セクション */}
        <div className="reading-card vocab-card">
          <div className="card-icon-wrapper">📕</div>
          <h3 className="card-title">単語帳機能</h3>
          <p className="card-description">
            TOEIC頻出単語を厳選収録。AIがあなたの記憶の定着度に合わせて、間違えやすい単語を優先的に出題します。
          </p>
          <button className="card-btn" onClick={() => handleStartSection('vocab')}>
            単語学習を始める 🚀
          </button>
        </div>

        {/* カード2：読解セクション */}
        <div className="reading-card reading-section-card">
          <div className="card-icon-wrapper">📖</div>
          <h3 className="card-title">読解セクション</h3>
          <p className="card-description">
            Part 6・7に対応した長文読解トレーニング。タイムマネジメントを意識しながら、素早く正確に情報を読み取る力を養います。
          </p>
          <button className="card-btn" onClick={() => handleStartSection('comprehension')}>
            読解演習に挑む ⚡
          </button>
        </div>

        {/* カード3：文法セクション */}
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
  );
}