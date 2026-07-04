import React from 'react';
import './AIConsultant.css';

export default function AIConsultant() {
  return (
    <main className="ai-consultant-page">
      <section className="ai-consultant-hero">
        <div>
          <span className="ai-consultant-eyebrow">AI English Consultant</span>
          <h1>Chat with your AI English coach</h1>
          <p>質問を入力すると、AIコンサルタントがあなたの学習状況に合わせたアドバイスを返します。</p>
        </div>
      </section>

      <section className="ai-consultant-panel">
        <div className="ai-consultant-card">
          <h2>AIコンサルタントに質問する</h2>
          <p>例：リーディングの速読力を伸ばすための今日の学習プランは？</p>
          <textarea
            className="ai-consultant-textarea"
            placeholder="ここに質問を入力してください。"
            rows="6"
          />
          <button className="ai-consultant-submit-btn">質問を送信する</button>
        </div>
        <div className="ai-consultant-tips-card">
          <h2>おすすめ質問例</h2>
          <ul>
            <li>語彙力アップの最短ルートは？</li>
            <li>リスニング力を上げる効果的な練習法は？</li>
            <li>英文の構成力を強化するコツを教えて</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
