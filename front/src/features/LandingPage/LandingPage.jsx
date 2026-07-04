import React from 'react';
import './LandingPage.css';
import DashBoard from './components/DashBoard';
import Reading from './components/Reading';
import Listening from './components/Listening';
import AIConsultant from './components/AIConsultant';
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
            onConsultantNavigate={() => {
              setMode('consultant');
              setActiveMenu('consultant');
            }}
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

        {/* 3. 新規登録画面（onAuthSuccess として handleAuthSuccess を渡す） */}
        {mode === 'signup' && (
          <SignUpForm 
            onNavigateToLanding={() => {
              setMode('landing');
              setActiveMenu('dashboard');
            }}
            onNavigateToLogin={() => setMode('login')}
            onAuthSuccess={handleAuthSuccess} 
          />
        )}

        {/* 4. 📚 リーディング */}
        {mode === 'chat' && (
          <Reading />
        )}

        {/* 5. 🎧 リスニング */}
        {mode === 'vocab' && (
          <Listening />
        )}

        {/* 6. 🤖 AIコンサルタント */}
        {mode === 'consultant' && (
          <AIConsultant />
        )}

        {/* 7. 📝 総合テスト */}
        {mode === 'test' && (
          <div className="chat-placeholder-container">
            <h2>📝 総合テスト画面（開発中）</h2>
          </div>
        )}

      </div>
    </div>
  );
}