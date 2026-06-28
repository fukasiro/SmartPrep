// front/src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import LoginForm from './features/auth/components/LoginForm';
import SignUpForm from './features/auth/components/SignUpForm';
import LandingPage from './features/LandingPage/LandingPage.jsx'; 
import Menu from './components/menu.jsx'; 

function App() {
  const [mode, setMode] = useState('landing'); 
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // 💡 本当のログイン状態を管理するState
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // サイドバーを表示する画面の条件
  const showSidebar = mode === 'landing' || mode === 'chat' || mode === 'grammar' || mode === 'vocab' || mode === 'analysis';

  useEffect(() => {
    const token = localStorage.getItem('eng_learning_access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setMode('chat');
    setActiveMenu('chat');
  };

  // 💡 メニューのナビゲーション処理を最適化
  const handleMenuNavigate = (target) => {
    if (target === 'dashboard' || target === 'landing') {
      setMode('landing');
      setActiveMenu('dashboard');
    } else {
      setMode(target);
      setActiveMenu(target);
    }
  };

  return (
    <div className="app-viewport">
      {/* 左側固定のサイドバーメニュー */}
      {showSidebar && (
        <Menu 
          currentMode={mode}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onNavigate={handleMenuNavigate}
          isLoggedIn={isLoggedIn} // 💡 ログイン状態をPropsとして渡す
          onLogout={() => {
            localStorage.removeItem('eng_learning_access_token');
            localStorage.removeItem('eng_learning_user');
            setIsLoggedIn(false); // ログアウト処理
            setMode('landing');
            setActiveMenu('dashboard');
          }}
        />
      )}

      {/* サイドバーの有無によってレイアウトクラスを切り替え */}
      <div className={showSidebar ? "app-main-content-area-with-sidebar" : "app-main-content-area-full"}>
        
        {/* 1. ランディングページ（ダッシュボード） */}
        {mode === 'landing' && (
          <LandingPage 
            onNavigateToLogin={() => setMode('login')} 
            onNavigateToSignUp={() => setMode('signup')}
            onStartLearning={handleAuthSuccess}
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
            onNavigateToChat={handleAuthSuccess}
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
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {/* 4. AI会話コーチ */}
        {mode === 'chat' && (
          <div className="chat-placeholder-container">
            <h2>🤖 AI会話コーチ画面（開発中）</h2>
          </div>
        )}

        {/* 5. 文法・表現添削 */}
        {mode === 'grammar' && (
          <div className="chat-placeholder-container">
            <h2>📝 文法・表現添削画面（開発中）</h2>
          </div>
        )}

        {/* 6. 単語・熟語サプリ */}
        {mode === 'vocab' && (
          <div className="chat-placeholder-container">
            <h2>📚 単語・熟語サプリ画面（開発中）</h2>
          </div>
        )}

        {/* 7. 新形式模試・分析 */}
        {mode === 'analysis' && (
          <div className="chat-placeholder-container">
            <h2>📈 新形式模試・分析画面（開発中）</h2>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;