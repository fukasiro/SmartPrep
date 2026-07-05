import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import './ForgotPasswordForm.css';

export default function ForgotPasswordForm({ onBackToLogin, onNavigateToLanding }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request');
  const { requestPasswordReset, resetPassword, loading, message } = useAuth();

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!email) return;

    const result = await requestPasswordReset(email);
    if (result) {
      setStep('confirm');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email || !code || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;

    const result = await resetPassword({ email, code, new_password: newPassword });
    if (result) {
      setStep('done');
    }
  };

  return (
    <div className="auth-page-container">
      <main className="main-content-card">
        <button className="back-to-home-btn" onClick={onNavigateToLanding}>
          ← ホームに戻る
        </button>

        <h1 className="page-title">パスワードを忘れた場合</h1>

        {step === 'request' && (
          <form onSubmit={handleRequest} className="login-form">
            <div className="form-input-group">
              <Input
                type="email"
                placeholder="登録済みのメールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-button-group">
              <Button type="submit" variant="primary">
                {loading ? '送信中...' : 'リセットコードを送信'}
              </Button>
            </div>

            <p className="forgot-description">
              登録済みのメールアドレスを入力すると、パスワード再設定用のコードをお送りします。
            </p>

            {message && <p className="status-message">{message}</p>}
          </form>
        )}

        {step === 'confirm' && (
          <form onSubmit={handleReset} className="login-form">
            <div className="form-input-group">
              <Input
                type="email"
                placeholder="登録済みのメールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-input-group">
              <Input
                type="text"
                placeholder="届いたコード"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="form-input-group">
              <Input
                type="password"
                placeholder="新しいパスワード"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-input-group">
              <Input
                type="password"
                placeholder="新しいパスワード（確認）"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-button-group">
              <Button type="submit" variant="primary">
                {loading ? '処理中...' : 'パスワードを再設定'}
              </Button>
            </div>

            <p className="forgot-description">
              受信したコードと新しいパスワードを入力してください。
            </p>

            {message && <p className="status-message">{message}</p>}
          </form>
        )}

        {step === 'done' && (
          <div className="reset-complete-box">
            <p className="reset-complete-message">
              パスワードが変更されました。ログイン画面から再度ログインしてください。
            </p>
            <button className="login-redirect-btn" onClick={onBackToLogin}>
              ログイン画面に戻る
            </button>
          </div>
        )}

        {step !== 'done' && (
          <p className="forgot-nav-text">
            <span className="forgot-link" onClick={onBackToLogin}>
              ログイン画面に戻る
            </span>
          </p>
        )}
      </main>
    </div>
  );
}
