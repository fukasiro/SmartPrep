import React from 'react';
import '../VocabularyCourseList.css';

export default function Level450Course({ onBack }) {
  return (
    <div className="vocab-list-container">
      <div className="vocab-list-card">
        <h2 className="vocab-list-title">450点レベル単語習得コース</h2>
        <p className="vocab-list-sub">基礎語彙を定着させ、TOEIC 450点レベルの語彙理解を確実にするための第一歩です。</p>

        <div className="vocab-course-detail">
          <p>このコースは、頻出単語の意味・例文・類語の学習を通じて基礎語彙を固めます。</p>
          <ul className="vocab-course-features">
            <li>日常・ビジネスでよく使われる重要単語</li>
            <li>例文と和訳で理解を深める</li>
            <li>単語テスト形式で定着確認</li>
          </ul>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="vocabulary-menu-secondary-button" onClick={onBack}>戻る</button>
        </div>
      </div>
    </div>
  );
}
