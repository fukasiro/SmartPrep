// front/src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './features/LandingPage/LandingPage.jsx'; 
import Menu from './components/menu.jsx';

function App() {
  const [mode, setMode] = useState('landing'); 
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [previousMode, setPreviousMode] = useState('chat');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('smartprep_dark_mode') === 'true';
  });

  // サイドバーを表示する画面の条件
  const showSidebar = mode === 'landing' || mode === 'chat' || mode === 'vocab' || mode === 'vocabMenu' || mode === 'vocabCourseList' || mode === 'myVocabulary' || mode === 'bookmarkVocabulary' || mode === 'aiVocabulary' || mode === 'readingMenu' || mode === 'readingCourseList' || mode === 'course450' || mode === 'course600' || mode === 'course730' || mode === 'course860' || mode === 'reading_course450' || mode === 'reading_course600' || mode === 'reading_course730' || mode === 'reading_course860' || mode === 'test' || mode === 'coach' || mode === 'coach_private' || mode === 'coach_school' || mode === 'mypage' || mode === 'consultant';

  useEffect(() => {
    const token = localStorage.getItem('eng_learning_access_token');
    const savedUser = localStorage.getItem('eng_learning_user');
    if (savedUser) {
      try {
        const userObj = JSON.parse(savedUser);
        setUserName(userObj.name || '');
        setUserEmail(userObj.email || '');
      } catch (e) {
        setUserName('');
        setUserEmail('');
      }
    }
    if (token || savedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('smartprep_dark_mode', isDarkMode ? 'true' : 'false');
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  const handleAuthSuccess = (name, email) => {
  // ストレージ保存は useAuth 側に任せるため削除

  // Stateの更新
    setUserName(name || '');
    setUserEmail(email || '');
    setIsLoggedIn(true);

  // チャット画面へ遷移
    setMode('chat'); 
    setActiveMenu('chat');
  };

  const handleGuestStart = () => {
    localStorage.removeItem('eng_learning_access_token');
    localStorage.removeItem('eng_learning_user');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('vocab-progress-storage-updated'));
    }
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
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
    setUserEmail('');
    setMode('landing');
    setActiveMenu('dashboard');
  };

  const deriveMenuKey = (targetMode) => {
    if (targetMode === 'landing') return 'dashboard';
    if (targetMode === 'consultant') return 'consultant';
    if (targetMode === 'mypage') return 'mypage';
    if (targetMode === 'test') return 'test';
    return 'chat';
  };

  const handleMenuNavigate = (target) => {
    if (target === 'consultant') {
      setPreviousMode(mode);
    }

    if (target === 'dashboard' || target === 'landing') {
      setMode('landing');
      setActiveMenu('dashboard');
    } else {
      setMode(target);
      setActiveMenu(target);
    }
  };

  const handleCloseConsultant = () => {
    const nextMode = previousMode || 'chat';
    setMode(nextMode);
    setActiveMenu(deriveMenuKey(nextMode));
  };

  const handleMyPage = () => {
    setMode('mypage');
    setActiveMenu('mypage');
  };

  return (
    <div className={`app-viewport${isDarkMode ? ' dark-mode' : ''}`}>
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
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}

      {/* 💡 メメインエリアは LandingPage にすべて委ねる構造へ */}
      <div className={showSidebar ? "app-main-content-area-with-sidebar" : "app-main-content-area-full"}>
        <LandingPage 
          mode={mode}
          setMode={setMode}
          setActiveMenu={setActiveMenu}
          setPreviousMode={setPreviousMode}
          onCloseConsultant={handleCloseConsultant}
          handleAuthSuccess={handleAuthSuccess}
          handleGuestStart={handleGuestStart}
          userName={userName}
          userEmail={userEmail}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}

export default App;