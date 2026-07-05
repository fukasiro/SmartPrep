// front/src/components/menu.jsx
import React from 'react';
import './menu.css';

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="menu-svg-icon" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V13h6v9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  reading: (
    <svg viewBox="0 0 24 24" className="menu-svg-icon" aria-hidden="true">
      <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11c1.38 0 2.5 1.12 2.5 2.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C5.12 20 4 18.88 4 17.5v-11Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6.5v11c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 7.5h7M8.5 10.5h7M8.5 13.5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 4.5v15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  vocab: (
    <svg
  viewBox="0 0 24 24"
  className="menu-svg-icon"
  aria-hidden="true"
>
  <path
    d="M4 13v4a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4Zm16 0v4a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3Z"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
  <path
    d="M4 13V12a8 8 0 0 1 16 0v1"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
  ),
  consultant: (
    <svg
  viewBox="0 0 24 24"
  className="menu-svg-icon"
  aria-hidden="true"
>
  <path
    d="M12 3v2"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
  <rect
    x="5"
    y="5"
    width="14"
    height="12"
    rx="4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  />
  <circle cx="9.5" cy="10.5" r="1" fill="currentColor" />
  <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
  <path
    d="M9.5 14c.8.6 1.6.9 2.5.9s1.7-.3 2.5-.9"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
</svg>
  ),
  test: (
    <svg viewBox="0 0 24 24" className="menu-svg-icon" aria-hidden="true">
      <path d="M7 4h10v4H7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="8" width="14" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 13l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

export default function Menu({ currentMode, activeMenu, setActiveMenu, onNavigate, onMyPage, isLoggedIn, userName }) {
  
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
          className={`sidebar-item dashboard-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('landing');
            setActiveMenu('dashboard');
          }}
          title="ダッシュボード"
        >
          <span className="icon">{icons.dashboard}</span>
          <span className="sidebar-label">ダッシュボード</span>
        </button>

        {/* 📚 リーディング */}
        <button 
          className={`sidebar-item reading-item ${activeMenu === 'chat' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('chat');
            setActiveMenu('chat');
          }}
          title="リーディング"
        >
          <span className="icon">{icons.reading}</span>
          <span className="sidebar-label">リーディング</span>
        </button>

        {/* 🎧 リスニング */}
        <button 
          className={`sidebar-item vocab-item ${activeMenu === 'vocab' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('vocab');
            setActiveMenu('vocab');
          }}
          title="リスニング"
        >
          <span className="icon">{icons.vocab}</span>
          <span className="sidebar-label">リスニング</span>
        </button>

        {/* 🤖 AIコンサルタント */}
        <button 
          className={`sidebar-item consultant-item ${activeMenu === 'consultant' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('consultant');
            setActiveMenu('consultant');
          }}
          title="AIコンサルタント"
        >
          <span className="icon">{icons.consultant}</span>
          <span className="sidebar-label">AIコンサルタント</span>
        </button>

        {/* 📝 総合テスト */}
        <button 
          className={`sidebar-item test-item ${activeMenu === 'test' ? 'active' : ''}`}
          onClick={() => {
            onNavigate('test');
            setActiveMenu('test');
          }}
          title="総合テスト"
        >
          <span className="icon">{icons.test}</span>
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
                </div>
              </div>
              <button className="sidebar-mypage-btn" onClick={onMyPage} title="マイページへ" aria-label="マイページへ">
                マイページ
              </button>
            </div>
            <button className="mobile-avatar-btn" onClick={onMyPage} title="マイページへ" aria-label="マイページへ">
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