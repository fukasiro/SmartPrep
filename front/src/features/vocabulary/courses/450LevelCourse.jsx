import React, { useEffect, useState, useMemo } from 'react';
import './450LevelCourse.css';
import WORDS from './450_wordlist';

const STORAGE_KEY = 'vocab_450_stage_scores';

// ==========================================
// 設定の調整
// ==========================================
const STAGE_LABEL = 'ステージ'; 
const PER_STAGE = 10;          
const PASS_SCORE = 7;          
// ==========================================

export default function Level450Course({ onBack }) {
  const [screen, setScreen] = useState('stage_select');
  const [selectedStage, setSelectedStage] = useState(0);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  
  // クイズ関連
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // スコア記録 { 0: 8, 1: 5 }
  const [stageScores, setStageScores] = useState({});
  
  // 証明書モーダルの表示フラグ
  const [showCertificate, setShowCertificate] = useState(false);

  // 総ステージ数
  const totalStages = Math.ceil(WORDS.length / PER_STAGE);

  // 進捗ロード
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStageScores(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // クリア（合格）したステージの総数を計算
  const clearedCount = useMemo(() => {
    return Object.values(stageScores).filter(score => score >= PASS_SCORE).length;
  }, [stageScores]);

  // 進捗パーセンテージ（整数）
  const progressPercent = useMemo(() => {
    if (totalStages === 0) return 0;
    return Math.floor((clearedCount / totalStages) * 100);
  }, [clearedCount, totalStages]);

  // 全ステージクリアしているか判定
  const isAllCleared = useMemo(() => {
    return totalStages > 0 && clearedCount === totalStages;
  }, [clearedCount, totalStages]);

  // 今回の10語を抽出
  const todaysWords = useMemo(() => {
    const start = selectedStage * PER_STAGE;
    return WORDS.slice(start, start + PER_STAGE);
  }, [selectedStage]);

  // クイズの4択を自動生成
  const quizQuestions = useMemo(() => {
    if (todaysWords.length === 0) return [];
    return todaysWords.map((wordObj) => {
      const incorrects = WORDS
        .filter((w) => w.meaning !== wordObj.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => w.meaning);
      const choices = [wordObj.meaning, ...incorrects].sort(() => 0.5 - Math.random());
      return {
        word: wordObj.word,
        pos: wordObj.pos,
        correct: wordObj.meaning,
        choices: choices,
      };
    });
  }, [todaysWords]);

  const handleGoToMenu = () => {
    setScreen('stage_select');
    setCurrentWordIdx(0);
    setCurrentQuizIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const startStage = (stageIndex) => {
    setSelectedStage(stageIndex);
    setCurrentWordIdx(0);
    setScreen('learning');
  };

  const skipToQuiz = () => {
    setCurrentQuizIdx(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setScreen('quiz');
  };

  const nextWord = () => {
    if (currentWordIdx < todaysWords.length - 1) {
      setCurrentWordIdx((prev) => prev + 1);
    } else {
      skipToQuiz();
    }
  };

  const handleSelectAnswer = (choice) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);
    if (choice === quizQuestions[currentQuizIdx].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuiz = () => {
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setScreen('result');
      
      const finalScore = score + (selectedAnswer === quizQuestions[currentQuizIdx].correct ? 1 : 0);
      const previousScore = stageScores[selectedStage] !== undefined ? stageScores[selectedStage] : -1;
      
      let nextScores = { ...stageScores };
      if (finalScore > previousScore) {
        nextScores[selectedStage] = finalScore;
      } else if (previousScore === -1) {
        nextScores[selectedStage] = finalScore;
      }
      
      setStageScores(nextScores);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextScores));
      } catch (e) {}

      // もしこの合格で「全クリア」を達成したら、お祝いのために証明書フラグを立てる
      const updatedClearedCount = Object.values(nextScores).filter(s => s >= PASS_SCORE).length;
      if (updatedClearedCount === totalStages && finalScore >= PASS_SCORE) {
        setShowCertificate(true);
      }
    }
  };

  const getStageName = (index) => `${STAGE_LABEL} ${index + 1}`;

  return (
    <div className="vocab-list-container">
      
      {/* 1. ステージ選択メニュー画面 */}
      {screen === 'stage_select' && (
        <div className="vocab-list-card">
          <h2 className="vocab-list-title">450点レベル単語習得コース</h2>
          <p className="vocab-list-sub">1回につき{PER_STAGE}語ずつサクッと学習。{PASS_SCORE}問以上正解でクリア！</p>
          
          {/* 📊 ステータスバー（プログレスバー） */}
          <div className="progress-container">
            <div className="progress-bar-label">
              <span>全体の進捗度</span>
              <strong>{progressPercent}% ({clearedCount} / {totalStages} クリア)</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* 全クリア時にいつでも証明書を見られる特設ボタン */}
          {isAllCleared && (
            <button className="view-cert-badge-btn" onClick={() => setShowCertificate(true)}>
              🏅 合格証明書を表示する
            </button>
          )}
          
          <div className="day-grid">
            {Array.from({ length: totalStages }).map((_, index) => {
              const savedScore = stageScores[index];
              let statusText = '未挑戦';
              let btnClass = 'day-btn';
              
              if (savedScore !== undefined) {
                if (savedScore >= PASS_SCORE) {
                  statusText = '✓ クリア';
                  btnClass += ' cleared';
                } else {
                  statusText = '⏳ 挑戦中';
                  btnClass += ' progressing';
                }
              }

              return (
                <button key={index} className={btnClass} onClick={() => startStage(index)}>
                  <span className="day-num">{getStageName(index)}</span>
                  <span className="day-status">{statusText}</span>
                </button>
              );
            })}
          </div>

          <div className="vocab-menu-actions" style={{ marginTop: 24, justifyContent: 'flex-start' }}>
            <button className="vocabulary-menu-secondary-button" onClick={onBack}>戻る</button>
          </div>
        </div>
      )}

      {/* 2. 単語カード画面 */}
      {screen === 'learning' && todaysWords.length > 0 && (
        <div className="vocab-list-card text-center">
          <div className="screen-header">
            <span>{getStageName(selectedStage)} - 単語学習 ({currentWordIdx + 1} / {todaysWords.length})</span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button className="learning-quiz-skip-btn" onClick={skipToQuiz}>今すぐクイズ 📝</button>
              <button className="exit-btn" onClick={handleGoToMenu}>中断</button>
            </div>
          </div>

          <div className="word-flashcard">
            <span className="card-pos">[{todaysWords[currentWordIdx].pos}]</span>
            <h1 className="card-word">{todaysWords[currentWordIdx].word}</h1>
            <div className="card-divider"></div>
            <p className="card-meaning">{todaysWords[currentWordIdx].meaning}</p>
          </div>

          <button className="vocabulary-menu-primary-button w-100" onClick={nextWord}>
            {currentWordIdx < todaysWords.length - 1 ? '次の単語へ' : '確認クイズへ進む 🚀'}
          </button>
        </div>
      )}

      {/* 3. クイズ画面 */}
      {screen === 'quiz' && quizQuestions.length > 0 && (
        <div className="vocab-list-card">
          <div className="screen-header">
            <span>{getStageName(selectedStage)} - クイズ ({currentQuizIdx + 1} / {quizQuestions.length})</span>
            <button className="exit-btn" onClick={handleGoToMenu}>中断</button>
          </div>

          <div className="quiz-box">
            <p className="quiz-question-label">正しい意味を選んでください：</p>
            <h2 className="quiz-word">{quizQuestions[currentQuizIdx].word} <span style={{fontSize: '14px', fontWeight: 'normal'}}>({quizQuestions[currentQuizIdx].pos})</span></h2>

            <div className="quiz-choices">
              {quizQuestions[currentQuizIdx].choices.map((choice, i) => {
                let btnClass = 'choice-btn';
                if (isAnswered) {
                  if (choice === quizQuestions[currentQuizIdx].correct) {
                    btnClass += ' correct-choice';
                  } else if (choice === selectedAnswer) {
                    btnClass += ' wrong-choice';
                  } else {
                    btnClass += ' disabled-choice';
                  }
                }
                return (
                  <button key={i} className={btnClass} onClick={() => handleSelectAnswer(choice)} disabled={isAnswered}>
                    {choice}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="quiz-feedback">
                {selectedAnswer === quizQuestions[currentQuizIdx].correct ? (
                  <p className="feedback-text correct">⭕ 正解！</p>
                ) : (
                  <p className="feedback-text wrong">❌ 不正解...（正解: {quizQuestions[currentQuizIdx].correct}）</p>
                )}
                <button className="vocabulary-menu-primary-button w-100" onClick={nextQuiz}>
                  {currentQuizIdx < quizQuestions.length - 1 ? '次の問題へ' : '結果を見る'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. 結果画面 */}
      {screen === 'result' && (
        <div className="vocab-list-card text-center">
          {score >= PASS_SCORE ? (
            <>
              <h2 className="vocab-list-title" style={{ color: '#2f855a' }}>🎉 合格！クリアです！</h2>
              <p className="vocab-list-sub">{getStageName(selectedStage)} を突破しました！</p>
            </>
          ) : (
            <>
              <h2 className="vocab-list-title" style={{ color: '#c53030' }}>😭 不合格...（あと一歩！）</h2>
              <p className="vocab-list-sub">クリアには {PASS_SCORE} 問以上の正解が必要です。</p>
            </>
          )}

          <div className="result-score-box" style={{ backgroundColor: score >= PASS_SCORE ? '#f0fff4' : '#fff5f5', color: score >= PASS_SCORE ? '#2f855a' : '#c53030' }}>
            <span className="result-score-num">{score}</span> / {quizQuestions.length} 問正解
          </div>

          <p className="result-comment">
            {score >= PASS_SCORE 
              ? '素晴らしい集中力です！この調子で次のステージにも挑戦してみましょう！' 
              : '履歴に「挑戦中」として記録されました！諦めずに再チャレンジしましょう！'}
          </p>

          <button className="vocabulary-menu-primary-button w-100" onClick={handleGoToMenu}>
            {isAllCleared && score >= PASS_SCORE ? '全ステージクリア！証明書を見る 🏅' : 'ステージ一覧に戻る'}
          </button>
        </div>
      )}

      {/* 🏅 全ステージクリア祝い：合格証明書モーダルポップアップ */}
      {showCertificate && (
        <div className="cert-overlay">
          <div className="cert-modal animate-pop">
            <div className="cert-border">
              <div className="cert-ribbon">🏅</div>
              <h1 className="cert-main-title">合格証明書</h1>
              <p className="cert-sub-title">CERTIFICATE OF COMPLETION</p>
              
              <div className="cert-divider-gold"></div>
              
              <p className="cert-user-text">あなた（学習者殿）</p>
              
              <p className="cert-body-text">
                あなたは、TOEIC 450点レベルに必須とされる基礎語彙のトレーニングおよび確認クイズをすべて優秀な成績で修め、全ステージを完全攻略したことをここに証明します。
              </p>
              
              <div className="cert-footer">
                <p>TOEIC単語マスターアプリ開発チーム</p>
                <p className="cert-date">達成日: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <button className="cert-close-btn" onClick={() => setShowCertificate(false)}>閉じる</button>
          </div>
        </div>
      )}

    </div>
  );
}