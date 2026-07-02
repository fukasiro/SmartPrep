// front/src/components/menu.jsx
import React from 'react';
import './menu.css';

export default function Menu({ currentMode, activeMenu, setActiveMenu, onNavigate, onLogout, isLoggedIn, userName }) {
  
  return (
    <aside className="app-sidebar">
      {/* 1. 最上部：サービスロゴ */}
      <div className="sidebar-logo" onClick={() => onNavigate('landing')}>
        SmartPrep
      </div>

      {/* 2. 中央：学習用メインメニュー */}
      <nav className="sidebar-nav-menu">
        {/* 🏠 ダッシュボード */}
        <button 
          className={`sidebar-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('landing');
            setActiveMenu('dashboard');
          }}
          title="ダッシュボード"
        >
          <span className="icon">🏠</span>
          <span className="sidebar-label">ダッシュボード</span>
        </button>

        {/* 📚 リーディング */}
        <button 
          className={`sidebar-item ${activeMenu === 'chat' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('chat');
            setActiveMenu('chat');
          }}
          title="リーディング"
        >
          <span className="icon">📚</span>
          <span className="sidebar-label">リーディング</span>
        </button>

        {/* 🎧 リスニング */}
        <button 
          className={`sidebar-item ${activeMenu === 'vocab' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('vocab');
            setActiveMenu('vocab');
          }}
          title="リスニング"
        >
          <span className="icon">🎧</span>
          <span className="sidebar-label">リスニング</span>
        </button>

        {/* ✍️ ライティング */}
        <button 
          className={`sidebar-item ${activeMenu === 'analysis' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('analysis');
            setActiveMenu('analysis');
          }}
          title="ライティング"
        >
          <span className="icon">✍️</span>
          <span className="sidebar-label">ライティング</span>
        </button>

        {/* 📝 総合テスト */}
        <button 
          className={`sidebar-item ${activeMenu === 'test' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('test');
            setActiveMenu('test');
          }}
          title="総合テスト"
        >
          <span className="icon">📝</span>
          <span className="sidebar-label">総合テスト</span>
        </button>
      </nav>

      {/* 3. 最下部：ログイン・新規登録 or プロフィール切替領域 */}
      <div className="sidebar-footer-area">
        <button className="mode-toggle-btn-sidebar">💡 ダークモード</button>
        
        <div className="auth-separator"></div>

        {!isLoggedIn ? (
          /* 未ログイン時 */
          <div className="sidebar-auth-buttons">
            <button className={`nav-login-btn pc-only-btn ${currentMode === 'login' ? 'active' : ''}`} onClick={() => onNavigate('login')} title="ログイン">
              ログイン
            </button>
            <button className={`nav-signup-btn pc-only-btn ${currentMode === 'signup' ? 'active' : ''}`} onClick={() => onNavigate('signup')} title="新規登録">
              新規登録
            </button>

            {/* スマホ用：未ログイン時のアイコン（常にグレー） */}
            <button 
              className={`mobile-avatar-btn ${currentMode === 'login' ? 'active' : ''}`} 
              onClick={() => onNavigate('login')} 
              title="ログイン画面へ"
            >
              <svg viewBox="0 0 24 24" className="profile-icon">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5.5 18.5a6.5 6.5 0 0 1 13 0" />
              </svg>
            </button>
          </div>
        ) : (
          /* ログイン済みの時 */
          <>
            {/* PC表示用のプロフィールボックス */}
            <div className="sidebar-profile-box pc-profile-box">
              <div className="profile-info">
                <div className="profile-avatar">👤</div>
                <div className="profile-details">
                  <span className="profile-name">{userName || 'ゲストユーザー'}</span>
                  <span className="profile-status">Premium 会員</span>
                </div>
              </div>
              <button className="sidebar-logout-btn" onClick={onLogout}>
                ログアウト
              </button>
            </div>

            {/* スマホ用：ログイン済みのアイコン（未ログインと全く同じグレーデザインで統一） */}
            <button 
              className="mobile-avatar-btn" 
              onClick={onLogout}
              title="ログアウトする"
              aria-label="ログアウトする"
            >
              <svg viewBox="0 0 24 24" className="profile-icon">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5.5 18.5a6.5 6.5 0 0 1 13 0" />
              </svg>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}