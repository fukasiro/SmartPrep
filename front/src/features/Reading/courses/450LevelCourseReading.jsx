import React, { useEffect, useState, useMemo } from 'react';
import './450LevelCourseReading.css';

// 外部ファイルから読解問題データをインポート
import READING_STAGES from './450_Reading';

// 進捗保存用の関数も共通のものを利用する場合はパスを合わせてアンコメントしてください
// import { loadCourseProgress, saveCourseProgress } from '../../vocabulary/progressStorage';

const STORAGE_KEY = 'reading_450_stage_scores';
const STAGE_LABEL = '講';
const PASS_SCORE = 3; // 1ステージあたり3〜4問想定のため、3問以上正解をベースラインに設定

export default function Level450CourseReading({ onBack }) {
  const [screen, setScreen] = useState('stage_select');
  const [selectedStage, setSelectedStage] = useState(0);
  const [showConsultantPanel, setShowConsultantPanel] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachAnswer, setCoachAnswer] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState('');

  const handleAskCoach = () => {
    setShowConsultantPanel(true);
  };

  const closeConsultantPanel = () => {
    setShowConsultantPanel(false);
    setCoachQuestion('');
    setCoachAnswer('');
    setCoachError('');
  };

  const submitCoachQuestion = async () => {
    if (!coachQuestion.trim()) {
      setCoachError('質問を入力してください。');
      return;
    }

    setCoachLoading(true);
    setCoachError('');
    setCoachAnswer('');

    try {
      const response = await fetch('http://localhost:8000/ai/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: coachQuestion.trim(),
          context: currentStageData?.passage || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        const detail = error?.detail || response.statusText;
        throw new Error(detail);
      }

      const result = await response.json();
      setCoachAnswer(result.answer || 'AIからの応答がありませんでした。');
    } catch (err) {
      setCoachError(err instanceof Error ? err.message : 'AIへの問い合わせに失敗しました。');
    } finally {
      setCoachLoading(false);
    }
  };

  // クイズ関連
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // スコア記録・証明書
  const [stageScores, setStageScores] = useState({});
  const [showCertificate, setShowCertificate] = useState(false);

  const totalStages = READING_STAGES.length;

  // 進捗データのロード
  useEffect(() => {
    const loadProgress = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setStageScores(JSON.parse(saved));
    };
    loadProgress();
  }, []);

  // 進捗データのセーブ
  const saveProgress = (nextScores) => {
    setStageScores(nextScores);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextScores));
  };

  // クリア（合格）したステージの総数を計算
  const clearedCount = useMemo(() => {
    return Object.keys(stageScores).filter(key => {
      const stageIdx = parseInt(key, 10);
      const stage = READING_STAGES[stageIdx];
      const passBoundary = stage ? Math.min(PASS_SCORE, stage.questions.length) : PASS_SCORE;
      return stageScores[key] >= passBoundary;
    }).length;
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

  // 現在選択中のステージデータ
  const currentStageData = useMemo(() => {
    return READING_STAGES[selectedStage] || null;
  }, [selectedStage]);

  const handleGoToMenu = () => {
    setScreen('stage_select');
    setCurrentQuizIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowConsultantPanel(false); // メニューに戻るときはコーチを閉じる
  };

  // ステージ選択後、直接クイズ画面へ移行
  const startStage = (stageIndex) => {
    setSelectedStage(stageIndex);
    setCurrentQuizIdx(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setScreen('quiz');
  };

  const handleSelectAnswer = (choice) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    setIsAnswered(true);
    if (choice === currentStageData.questions[currentQuizIdx].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuiz = () => {
    const questions = currentStageData.questions;
    if (currentQuizIdx < questions.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setScreen('result');

      const finalScore = score + (selectedAnswer === questions[currentQuizIdx].correct ? 1 : 0);
      const previousScore = stageScores[selectedStage] !== undefined ? stageScores[selectedStage] : -1;

      let nextScores = { ...stageScores };
      if (finalScore > previousScore) {
        nextScores[selectedStage] = finalScore;
      }

      saveProgress(nextScores);

      const passBoundary = Math.min(PASS_SCORE, questions.length);
      const updatedClearedCount = Object.keys(nextScores).filter(key => {
        const idx = parseInt(key, 10);
        const stg = READING_STAGES[idx];
        const pb = stg ? Math.min(PASS_SCORE, stg.questions.length) : PASS_SCORE;
        return nextScores[key] >= pb;
      }).length;

      if (updatedClearedCount === totalStages && finalScore >= passBoundary) {
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
          <div className="course-header-row">
            <div>
              <h2 className="vocab-list-title">450点レベル読解突破コース</h2>
              <p className="vocab-list-sub">Part 6/7の基礎長文を攻略。各問題の7割以上正解でクリア！</p>
            </div>
          </div>

          {/* 📊 全体進捗バー */}
          <div className="progress-container">
            <div className="progress-bar-label">
              <span>全体の進捗度</span>
              <strong>{progressPercent}% ({clearedCount} / {totalStages} クリア)</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* 全クリア時に表示される証明書確認ボタン */}
          {isAllCleared && (
            <button className="view-cert-badge-btn" onClick={() => setShowCertificate(true)}>
              🏅 読解マスター証明書を表示する
            </button>
          )}

          {/* グリッドメニュー */}
          <div className="day-grid">
            {READING_STAGES.map((stage, index) => {
              const savedScore = stageScores[index];
              const passBoundary = Math.min(PASS_SCORE, stage.questions.length);
              let statusText = '未挑戦';
              let btnClass = 'day-btn';

              if (savedScore !== undefined) {
                if (savedScore >= passBoundary) {
                  statusText = `✓ クリア (${savedScore}点)`;
                  btnClass += ' cleared';
                } else {
                  statusText = `⏳ 挑戦中 (${savedScore}点)`;
                  btnClass += ' progressing';
                }
              }

              return (
                <button key={stage.id} className={btnClass} onClick={() => startStage(index)}>
                  <span className="day-num">{getStageName(index)}</span>
                  <span className="reading-stage-tag">{stage.passageType}</span>
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

      {/* 2. クイズ画面 */}
      {screen === 'quiz' && currentStageData && (
        <div className="reading-stage-card-wrapper">
          <div className={`vocab-list-card reading-stage-card${showConsultantPanel ? ' coach-open' : ''}`}>
            {/* ヘッダーエリア */}
            <div className="screen-header reading-full-width">
              <span>{getStageName(selectedStage)} - 問題 ({currentQuizIdx + 1} / {currentStageData.questions.length})</span>
              <div className="reading-header-actions">
                <button className="ai-coach-button" onClick={handleAskCoach}>AIコーチ</button>
                <button className="exit-btn" onClick={handleGoToMenu}>中断</button>
              </div>
            </div>

            {/* 本文エリア */}
            <div className="reading-passage-section">
              <span className="passage-badge">{currentStageData.passageType}</span>
              <div className="passage-content">{currentStageData.passage}</div>
            </div>

            {/* クイズエリア */}
            <div className="reading-quiz-section">
              <div className="quiz-box" style={{ padding: 0 }}>
                <p className="quiz-question-label">Q{currentQuizIdx + 1}.</p>
                <h2 className="quiz-word" style={{ fontSize: '18px', marginBottom: '16px' }}>
                  {currentStageData.questions[currentQuizIdx].questionText}
                </h2>

                <div className="quiz-choices">
                  {currentStageData.questions[currentQuizIdx].choices.map((choice, i) => {
                    let btnClass = 'choice-btn';
                    if (isAnswered) {
                      if (choice === currentStageData.questions[currentQuizIdx].correct) {
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

                {/* 解答後のフィードバック＆解説 */}
                {isAnswered && (
                  <div className="quiz-feedback" style={{ marginTop: '12px', paddingTop: '12px' }}>
                    {selectedAnswer === currentStageData.questions[currentQuizIdx].correct ? (
                      <p className="feedback-text correct" style={{ fontSize: '16px', marginBottom: '8px' }}>⭕ 正解！</p>
                    ) : (
                      <p className="feedback-text wrong" style={{ fontSize: '16px', marginBottom: '8px' }}>❌ 不正解...</p>
                    )}
                    <div className="reading-explanation-box">
                      <strong>解説:</strong> {currentStageData.questions[currentQuizIdx].explanation}
                    </div>
                    <button className="vocabulary-menu-primary-button w-100" onClick={nextQuiz} style={{ marginTop: '12px' }}>
                      {currentQuizIdx < currentStageData.questions.length - 1 ? '次の問題へ' : '結果を見る'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AIコーチパネル */}
          {showConsultantPanel && (
            <div className="reading-consultant-panel animate-slide-in">
              <div className="consultant-header">
                <div>
                  <h3>AIコーチ</h3>
                  <p>質問を入力してヒントをもらいましょう。</p>
                </div>
                <button className="consultant-close-btn" onClick={closeConsultantPanel}>閉じる</button>
              </div>
                  <textarea
                className="consultant-textarea"
                placeholder="例えば：本文の要点の探し方を教えてください。"
                rows="6"
                value={coachQuestion}
                onChange={(e) => {
                  setCoachQuestion(e.target.value);
                  if (coachError) setCoachError('');
                }}
              />
              <button className="consultant-submit-btn" onClick={submitCoachQuestion} disabled={coachLoading}>
                {coachLoading ? '送信中…' : '送信する'}
              </button>
              {coachError && <p className="consultant-error-text">{coachError}</p>}
              {coachAnswer && (
                <div className="consultant-answer-box">
                  <h4>AIコーチの回答</h4>
                  <p>{coachAnswer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. 結果画面 */}
      {screen === 'result' && currentStageData && (
        <div className="vocab-list-card text-center">
          {score >= Math.min(PASS_SCORE, currentStageData.questions.length) ? (
            <>
              <h2 className="vocab-list-title" style={{ color: '#2f855a' }}>🎉 ステージクリア！</h2>
              <p className="vocab-list-sub">{getStageName(selectedStage)} の読解に成功しました！</p>
            </>
          ) : (
            <>
              <h2 className="vocab-list-title" style={{ color: '#c53030' }}>😭 クリアならず...</h2>
              <p className="vocab-list-sub">もう一度本文をじっくり読み直してみましょう。</p>
            </>
          )}

          <div className="result-score-box" style={{
            backgroundColor: score >= Math.min(PASS_SCORE, currentStageData.questions.length) ? '#f0fff4' : '#fff5f5',
            color: score >= Math.min(PASS_SCORE, currentStageData.questions.length) ? '#2f855a' : '#c53030'
          }}>
            <span className="result-score-num">{score}</span> / {currentStageData.questions.length} 問正解
          </div>

          <button className="vocabulary-menu-primary-button w-100" onClick={handleGoToMenu}>
            {isAllCleared && score >= Math.min(PASS_SCORE, currentStageData.questions.length) ? '全クリア！証明書を見る 🏅' : 'ステージ一覧に戻る'}
          </button>
        </div>
      )}

      {/* 🏅 合格証明書モーダル */}
      {showCertificate && (
        <div className="cert-overlay">
          <div className="cert-modal animate-pop">
            <div className="cert-border">
              <div className="cert-ribbon">🏅</div>
              <h1 className="cert-main-title" style={{ fontSize: '24px' }}>リーディング証明書</h1>
              <p className="cert-sub-title">READING COURSE COMPLETION</p>
              <div className="cert-divider-gold"></div>
              <p className="cert-user-text">あなた（学習者殿）</p>
              <p className="cert-body-text">
                あなたは、TOEIC 450点レベルに必要な「Part 6 長文穴埋め」および「Part 7 基礎読解」の全トレーニングを修了し、英文の主旨を正確に素早く掴むスキルを習得したことをここに証明します。
              </p>
              <div className="cert-footer">
                <p>TOEIC読解マスター開発チーム</p>
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