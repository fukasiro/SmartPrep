import React from 'react';
import './Mypage.css';

export default function Mypage({ userName = 'ゲストユーザー', onLogout, onBack }) {
  return (
    <div className="mypage-container">
      <section className="mypage-card">
        <header className="mypage-header">
          <div className="mypage-avatar" aria-hidden="true">👤</div>
          <div className="mypage-profile">
            <h2>{userName}</h2>
            <p>アカウント情報</p>
          </div>
        </header>

        <div className="mypage-info">
          <div className="mypage-info-row">
            <span className="label">ユーザー名</span>
            <span className="value" title={userName}>{userName}</span>
          </div>
          <div className="mypage-info-row">
            <span className="label">登録状況</span>
            <span className="value">ログイン中</span>
          </div>
        </div>

        <div className="mypage-actions">
          <button type="button" className="mypage-button secondary" onClick={onBack}>
            戻る
          </button>
          <button type="button" className="mypage-button primary" onClick={onLogout}>
            ログアウト
          </button>
        </div>
      </section>
    </div>
  );
}