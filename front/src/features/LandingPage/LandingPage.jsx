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
import MyVocabulary from '../vocabulary/MyVocabulary';
import AiVocabulary from '../vocabulary/AiVocabulary/AiVocabulary';

// 共通化した VocabularyCourse と、各単語データリストを直接インポート
import VocabularyCourse from '../vocabulary/courses/VocabularyCourse';
import WORDS_450 from '../vocabulary/courses/450_wordlist';
import WORDS_600 from '../vocabulary/courses/600_wordlist';
import WORDS_730 from '../vocabulary/courses/730_wordlist';
import WORDS_860 from '../vocabulary/courses/860_wordlist';

// 共通化した ReadingCourse と、読解データリストをインポート
import ReadingCourse from '../Reading/courses/ReadingCourse.jsx';
import READING_STAGES_450 from '../Reading/courses/450_Reading.js';// 実際のデータファイル名に合わせて調整してください

import BookMarkVocabulary from '../vocabulary/vocabularyBook/BookMarkVocabulary';
import LoginForm from '../auth/components/LoginForm';
import SignUpForm from '../auth/components/SignUpForm';
import ForgotPasswordForm from '../auth/components/ForgotPasswordForm';
import Mypage from '../MyPage/Mypage';

export default function LandingPage({ 
  mode, 
  setMode, 
  setActiveMenu, 
  onCloseConsultant,
  handleAuthSuccess,
  handleGuestStart,
  userName,
  userEmail,
  handleLogout,
}) {
  return (
    <div className="landing-container">
      <div className="landing-main">
        
        {/* 1. ダッシュボード */}
        {mode === 'landing' && (
          <DashBoard 
            onStartLearning={handleGuestStart}
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
            onLoginSuccess={(token, name, email) => handleAuthSuccess(token, name, email)}
            onGuestStart={handleGuestStart}
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
              setActiveMenu('chat');
            }}
            onStartMyVocabulary={() => {
              setMode('myVocabulary');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'myVocabulary' && (
          <MyVocabulary
            onBack={() => {
              setMode('vocabMenu');
              setActiveMenu('chat');
            }}
            onSelect={(selection) => {
              if (selection === 'bookmark-custom') {
                setMode('bookmarkVocabulary');
                setActiveMenu('chat');
              } else if (selection === 'ai-personal') {
                setMode('aiVocabulary');
                setActiveMenu('chat');
              }
            }}
          />
        )}

        {mode === 'aiVocabulary' && (
          <AiVocabulary 
            onBack={() => setMode('vocabMenu')} 
            userEmail={userEmail}
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

        {/* 共通の VocabularyCourse コンポーネントに各レベルのパラメータを渡して直接出し分け */}
        {mode === 'course450' && (
          <VocabularyCourse
            courseTitle="450点レベル単語習得コース"
            words={WORDS_450}
            storageKey="vocab_450_stage_scores"
            onBack={() => {
              setMode('vocabCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {/* 🛠️ 古いLevel450CourseReadingから共通化したReadingCourseへ修正 */}
        {mode === 'reading_course450' && (
          <ReadingCourse
            courseTitle="450点レベル読解突破コース"
            courseSub="Part 6/7の基礎長文を攻略。各問題の7割以上正解でクリア！"
            stages={READING_STAGES_450}
            storageKey="reading_450_stage_scores"
            stageLabel="講"
            userName={userName}
            onBack={() => {
              setMode('readingCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'course600' && (
          <VocabularyCourse
            courseTitle="600点レベル単語習得コース"
            words={WORDS_600}
            storageKey="vocab_600_stage_scores"
            onBack={() => {
              setMode('vocabCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'course730' && (
          <VocabularyCourse
            courseTitle="730点レベル単語習得コース"
            words={WORDS_730}
            storageKey="vocab_730_stage_scores"
            onBack={() => {
              setMode('vocabCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'course860' && (
          <VocabularyCourse
            courseTitle="860点レベル単語習得コース"
            words={WORDS_860}
            storageKey="vocab_860_stage_scores"
            onBack={() => {
              setMode('vocabCourseList');
              setActiveMenu('chat');
            }}
          />
        )}

        {mode === 'bookmarkVocabulary' && (
          <BookMarkVocabulary
            onBack={() => {
              setMode('myVocabulary');
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
          <AIConsultant onClose={() => {
            if (typeof onCloseConsultant === 'function') {
              onCloseConsultant();
            } else {
              setMode('chat');
              setActiveMenu('chat');
            }
          }} />
        )}

        {/* 8. 📝 総合テスト */}
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