import React from 'react';
import './LandingPage.css';
import DashBoard from './components/DashBoard';
import Reading from './components/Reading';
import Listening from './components/Listening';
import AIConsultant from './components/AIConsultant';
import ReadingMenu from '../Reading/ReadingMenu';
import ReadingCourseList from '../Reading/ReadingCourseList';
import VocabularyMenu from '../vocabulary/VocabularyMenu';
import VocabularyCourseList from '../vocabulary/VocabularyCourseList';
import Level450Course from '../vocabulary/courses/450LevelCourse';
import Level450CourseReading from '../Reading/courses/450LevelCourseReading';
import Level600Course from '../vocabulary/courses/600LevelCourse';
import Level730Course from '../vocabulary/courses/730LevelCourse';
import Level860Course from '../vocabulary/courses/860LevelCourse';
import LoginForm from '../auth/components/LoginForm';
import SignUpForm from '../auth/components/SignUpForm';
import ForgotPasswordForm from '../auth/components/ForgotPasswordForm';
import Mypage from '../MyPage/Mypage';

export default function LandingPage({ 
  mode, 
  setMode, 
  setActiveMenu, 
  handleAuthSuccess,
  userName,
  handleLogout,
}) {
  return (
    <div className="landing-container">
      <div className="landing-main">
        
        {/* 1. ダッシュボード */}
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
            onNavigateToForgotPassword={() => setMode('forgotPassword')}
            onLoginSuccess={(token, name) => handleAuthSuccess(token, name)}
          />
        )}

        {mode === 'forgotPassword' && (
          <ForgotPasswordForm
            onBackToLogin={() => setMode('login')}
            onNavigateToLanding={() => {
              setMode('landing');
              setActiveMenu('dashboard');
            }}
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
          <Reading
            onStartVocabulary={() => {
              setMode('vocabMenu');
              setActiveMenu('chat');
            }}
            onStartReading={() => {
              setMode('readingMenu');
              setActiveMenu('chat');
            }}
          />
        )}

        {/* 4.5 読解メニュー */}
        {mode === 'readingMenu' && (
          <ReadingMenu
            onBack={() => {
              setMode('chat');
              setActiveMenu('chat');
            }}
            onStartCourse={() => {
              setMode('readingCourseList');
              setActiveMenu('chat');
            }}
            onStartAiCoach={() => {
              // 今後、AIコーチ画面へのナビゲーションを追加
              setMode('chat');
              setActiveMenu('chat');
            }}
          />
        )}

        {/* 4.6 読解コース一覧 */}
        {mode === 'readingCourseList' && (
          <ReadingCourseList
            onBack={() => {
              setMode('readingMenu');
              setActiveMenu('chat');
            }}
            onStart450={() => {
              setMode('reading_course450');
              setActiveMenu('chat');
            }}
            onStart600={() => {
              setMode('course600');
              setActiveMenu('chat');
            }}
            onStart730={() => {
              setMode('course730');
              setActiveMenu('chat');
            }}
            onStart860={() => {
              setMode('course860');
              setActiveMenu('chat');
            }}
          />
        )}

        {/* 5. 📘 単語学習 */}
        {mode === 'vocabMenu' && (
          <VocabularyMenu
            onBack={() => {
              setMode('chat');
              setActiveMenu('chat');
            }}
            onStartCourse={() => {
              setMode('vocabCourseList');
              // Vocabulary screens are conceptually under Reading (chat),
              // keep the sidebar active as 'chat' so the Reading menu stays highlighted.
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'vocabCourseList' && (
          <VocabularyCourseList
            onBack={() => {
              setMode('vocabMenu');
              setActiveMenu('chat');
            }}
            onStart450={() => {
              setMode('course450');
              setActiveMenu('chat');
            }}
            onStart600={() => {
              setMode('course600');
              setActiveMenu('chat');
            }}
            onStart730={() => {
              setMode('course730');
              setActiveMenu('chat');
            }}
            onStart860={() => {
              setMode('course860');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'course450' && (
          <Level450Course
            onBack={() => {
              setMode('vocabCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'reading_course450' && (
          <Level450CourseReading
            onBack={() => {
              setMode('readingCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'course600' && (
          <Level600Course
            onBack={() => {
              setMode('vocabCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'course730' && (
          <Level730Course
            onBack={() => {
              setMode('vocabCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'course860' && (
          <Level860Course
            onBack={() => {
              setMode('vocabCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {/* 6. 🎧 リスニング */}
        {mode === 'vocab' && (
          <Listening />
        )}

        {/* 7. 🤖 AIコンサルタント */}
        {mode === 'consultant' && (
          <AIConsultant />
        )}

        {/* 7. 📝 総合テスト */}
        {mode === 'test' && (
          <div className="chat-placeholder-container">
            <h2>📝 総合テスト画面（開発中）</h2>
          </div>
        )}

        {mode === 'mypage' && (
          <Mypage
            userName={userName}
            onLogout={() => {
              handleLogout();
            }}
            onBack={() => {
              setMode('chat');
              setActiveMenu('chat');
            }}
          />
        )}

      </div>
    </div>
  );
}