import React, { useEffect, useState, useMemo } from 'react';
import './450LevelCourse.css';
import WORDS from './450_wordlist';

const STORAGE_KEY = 'vocab_450_cleared_stages';

// ==========================================
// 設定の調整
// ==========================================
const STAGE_LABEL = 'ステージ'; 
const PER_STAGE = 10;          
const PASS_SCORE = 7;          
// ==========================================

export default function Level450Course({ onBack }) {
  // 画面モード: 'stage_select' | 'learning' | 'quiz' | 'result'
  const [screen, setScreen] = useState('stage_select');
  
  // 選択中のステージ番号（0スタート）
  const [selectedStage, setSelectedStage] = useState(0);
  
  // 学習中の単語インデックス（0 〜 9）
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  
  // クイズ関連
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // クリア済みのステージを保存する配列
  const [clearedStages, setClearedStages] = useState([]);

  // 総ステージ数（300語 ÷ 10語 = 30ステージ）
  const totalStages = Math.ceil(WORDS.length / PER_STAGE);

  // 進捗ロード
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setClearedStages(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  // メニューに戻る
  const handleGoToMenu = () => {
    setScreen('stage_select');
    setCurrentWordIdx(0);
    setCurrentQuizIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  // ステージ開始（単語学習画面へ）
  const startStage = (stageIndex) => {
    setSelectedStage(stageIndex);
    setCurrentWordIdx(0);
    setScreen('learning');
  };

  // 単語学習の途中から、または最初からクイズ画面へ直接ジャンプする
  const skipToQuiz = () => {
    setCurrentQuizIdx(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setScreen('quiz');
  };

  // 次の単語へ
  const nextWord = () => {
    if (currentWordIdx < todaysWords.length - 1) {
      setCurrentWordIdx((prev) => prev + 1);
    } else {
      skipToQuiz();
    }
  };

  // クイズ解答選択
  const handleSelectAnswer = (choice) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);
    
    if (choice === quizQuestions[currentQuizIdx].correct) {
      setScore((prev) => prev + 1);
    }
  };

  // 次のクイズへ（または結果画面へ）
  const nextQuiz = () => {
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setScreen('result');
      
      // 今回の最終スコアを計算
      const finalScore = score + (selectedAnswer === quizQuestions[currentQuizIdx].correct ? 1 : 0);
      
      // 合格点（7点）以上の場合のみクリア実績を保存
      if (finalScore >= PASS_SCORE) {
        if (!clearedStages.includes(selectedStage)) {
          const nextCleared = [...clearedStages, selectedStage];
          setClearedStages(nextCleared);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCleared));
          } catch (e) {}
        }
      }
    }
  };

  // ステージ名表示用のヘルパー関数
  const getStageName = (index) => {
    return `${STAGE_LABEL} ${index + 1}`;
  };

  return (
    <div className="vocab-list-container">
      
      {/* 1. ステージ選択メニュー画面 */}
      {screen === 'stage_select' && (
        <div className="vocab-list-card">
          <h2 className="vocab-list-title">450点レベル単語習得コース</h2>
          <p className="vocab-list-sub">1回につき{PER_STAGE}語ずつサクッと学習。{PASS_SCORE}問以上正解でクリア！</p>
          
          <div className="day-grid">
            {Array.from({ length: totalStages }).map((_, index) => {
              const isCleared = clearedStages.includes(index);
              return (
                <button 
                  key={index} 
                  className={`day-btn ${isCleared ? 'cleared' : ''}`}
                  onClick={() => startStage(index)}
                >
                  <span className="day-num">{getStageName(index)}</span>
                  <span className="day-status">{isCleared ? '✓ クリア' : '未クリア'}</span>
                </button>
              );
            })}
          </div>

          <div className="vocab-menu-actions" style={{ marginTop: 24, justifyContent: 'flex-start' }}>
            <button className="vocabulary-menu-secondary-button" onClick={onBack}>戻る</button>
          </div>
        </div>
      )}

      {/* 2. 1語ずつ表示する単語カード画面（★ここに「今すぐクイズ」ボタンを配置しました） */}
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

      {/* 3. 確認クイズ画面 */}
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
                  <button 
                    key={i} 
                    className={btnClass}
                    onClick={() => handleSelectAnswer(choice)}
                    disabled={isAnswered}
                  >
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
              : 'もう一度単語カードを見直して、再チャレンジしてみましょう！'}
          </p>

          <button className="vocabulary-menu-primary-button w-100" onClick={handleGoToMenu}>
            {score >= PASS_SCORE ? 'ステージ一覧に戻る' : 'もう一度挑戦する'}
          </button>
        </div>
      )}

    </div>
  );
}