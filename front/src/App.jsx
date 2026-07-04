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
  const showSidebar = mode === 'landing' || mode === 'chat' || mode === 'vocab' || mode === 'vocabMenu' || mode === 'vocabCourseList' || mode === 'readingMenu' || mode === 'readingCourseList' || mode === 'course450' || mode === 'course600' || mode === 'course730' || mode === 'course860' || mode === 'consultant' || mode === 'test';

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

  const handleAuthSuccess = (token, name) => {
    if (token) localStorage.setItem('eng_learning_access_token', token);
    if (name) {
      localStorage.setItem('eng_learning_user', JSON.stringify({ name }));
      setUserName(name);
    }
    setIsLoggedIn(true);
    setMode('chat'); 
    setActiveMenu('chat');
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

  return (
    <div className="app-viewport">
      {/* 左側固定のサイドバーメニュー */}
      {showSidebar && (
        <Menu 
          currentMode={mode}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          onNavigate={handleMenuNavigate}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogout={() => {
            localStorage.removeItem('eng_learning_access_token');
            localStorage.removeItem('eng_learning_user');
            setIsLoggedIn(false);
            setUserName('');
            setMode('landing');
            setActiveMenu('dashboard');
          }}
        />
      )}

      {/* 💡 メメインエリアは LandingPage にすべて委ねる構造へ */}
      <div className={showSidebar ? "app-main-content-area-with-sidebar" : "app-main-content-area-full"}>
        <LandingPage 
          mode={mode}
          setMode={setMode}
          setActiveMenu={setActiveMenu}
          handleAuthSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
}

export default App;