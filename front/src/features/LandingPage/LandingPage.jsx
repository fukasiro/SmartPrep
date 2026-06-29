// front/src/features/LandingPage/LandingPage.jsx
import React from 'react';
import './LandingPage.css';
import DashBoard from './components/DashBoard';
import Reading from './components/Reading'; // 💡 リーディングをインポート
import LoginForm from '../auth/components/LoginForm';
import SignUpForm from '../auth/components/SignUpForm';

export default function LandingPage({ 
  mode, 
  setMode, 
  setActiveMenu, 
  handleAuthSuccess 
}) {
  return (
    <div className="landing-container">
      <div className="landing-main">
        
        {/* 1. ダッシュボード（ホーム画面） */}
        {mode === 'landing' && (
          <DashBoard 
            onStartLearning={() => handleAuthSuccess(null, 'ゲストユーザー')} 
          />
        )}

        {/* 2. ログイン画面 */}
        {mode === 'login' && (
          <LoginForm 
            onNavigateToLanding={() => {
              setMode('landing');
              setActiveMenu('dashboard');
            }}
            onNavigateToSignUp={() => setMode('signup')}
            onLoginSuccess={(token, name) => handleAuthSuccess(token, name)}
          />
        )}

        {/* 3. 新規登録画面 */}
        {mode === 'signup' && (
          <SignUpForm 
            onNavigateToLanding={() => {
              setMode('landing');
              setActiveMenu('dashboard');
            }}
            onNavigateToLogin={() => setMode('login')}
          />
        )}

        {/* 4. 📚 リーディング（単語帳・読解・文法カード内包） */}
        {mode === 'chat' && (
          <Reading />
        )}

        {/* 5. 🎧 リスニング */}
        {mode === 'vocab' && (
          <div className="chat-placeholder-container">
            <h2>🎧 リスニング画面（開発中）</h2>
          </div>
        )}

        {/* 6. ✍️ ライティング */}
        {mode === 'analysis' && (
          <div className="chat-placeholder-container">
            <h2>✍️ ライティング画面（開発中）</h2>
          </div>
        )}

        {/* 7. 📝 総合テスト */}
        {(mode === 'test' || mode === 'chat' && mode === 'test') && (
          <div className="chat-placeholder-container">
            <h2>📝 総合テスト画面（開発中）</h2>
          </div>
        )}

      </div>
    </div>
  );
}