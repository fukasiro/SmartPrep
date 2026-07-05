// front/src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './features/LandingPage/LandingPage.jsx'; 
import Menu from './components/menu.jsx';

function App() {
  const [mode, setMode] = useState('landing'); 
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // サイドバーを表示する画面の条件
  const showSidebar = mode === 'landing' || mode === 'chat' || mode === 'vocab' || mode === 'vocabMenu' || mode === 'vocabCourseList' || mode === 'readingMenu' || mode === 'readingCourseList' || mode === 'course450' || mode === 'course600' || mode === 'course730' || mode === 'course860' || mode === 'consultant' || mode === 'test' || mode === 'mypage';

  useEffect(() => {
    const token = localStorage.getItem('eng_learning_access_token');
    const savedUser = localStorage.getItem('eng_learning_user');
    if (token) {
      setIsLoggedIn(true);
      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser);
          setUserName(userObj.name || '');
        } catch (e) {
          setUserName('');
        }
      }
    }
  }, []);

  const handleAuthSuccess = (token, name, email = null) => {
    if (token) localStorage.setItem('eng_learning_access_token', token);
    if (name || email) {
      const userPayload = { name: name || null, email: email || null };
      localStorage.setItem('eng_learning_user', JSON.stringify(userPayload));
      setUserName(name || '');
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('vocab-progress-storage-updated'));
    }
    setIsLoggedIn(true);
    setMode('chat'); 
    setActiveMenu('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('eng_learning_access_token');
    localStorage.removeItem('eng_learning_user');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('vocab-progress-storage-updated'));
    }
    setIsLoggedIn(false);
    setUserName('');
    setMode('landing');
    setActiveMenu('dashboard');
  };

  const handleMenuNavigate = (target) => {
    if (target === 'dashboard' || target === 'landing') {
      setMode('landing');
      setActiveMenu('dashboard');
    } else {
      setMode(target);
      setActiveMenu(target);
    }
  };

  const handleMyPage = () => {
    setMode('mypage');
    setActiveMenu('mypage');
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
          onMyPage={handleMyPage}
          isLoggedIn={isLoggedIn}
          userName={userName}
        />
      )}

      {/* 💡 メメインエリアは LandingPage にすべて委ねる構造へ */}
      <div className={showSidebar ? "app-main-content-area-with-sidebar" : "app-main-content-area-full"}>
        <LandingPage 
          mode={mode}
          setMode={setMode}
          setActiveMenu={setActiveMenu}
          handleAuthSuccess={handleAuthSuccess}
          userName={userName}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}

export default App;