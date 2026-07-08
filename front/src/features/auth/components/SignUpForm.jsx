import { useState } from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useAuth } from '../hooks/useAuth';
import VerifyCodeForm from './VerifyCodeForm';
import './SignUpForm.css'; 

export default function SignUpForm({ onNavigateToLanding, onNavigateToLogin, onAuthSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const { signUpWithEmail, loading, message } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    const result = await signUpWithEmail({ name, email, password });
    if (result?.email) {
      setPendingEmail(result.email);
      setIsVerificationStep(true);
    }
  };

  if (isVerificationStep) {
    return (
      <div className="auth-page-container">
        <main className="main-content-card">
          <button className="back-to-home-btn" onClick={onNavigateToLanding}>
            ← ホームに戻る
          </button>
          <h1 className="page-title">メール認証</h1>
          
          <VerifyCodeForm
            email={pendingEmail}
            name={name}
            onVerifySuccess={(token, userName) => {
              // 💡 親（LandingPage経由でApp.jsx）へ成功イベントを一撃で届けます
              if (onAuthSuccess) {
                onAuthSuccess(token, userName, pendingEmail);
              }
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <main className="main-content-card">
        
        <button className="back-to-home-btn" onClick={onNavigateToLanding}>
          ← ホームに戻る
        </button>

        <h1 className="page-title">アカウントを作ろう！</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-input-group">
            <Input
              type="text"
              placeholder="ユーザー名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-input-group">
            <Input
              type="email"
              placeholder="Eメールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-input-group">
            <Input
              type="password"
              placeholder="パスワードを作成"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-button-group">
            <Button type="submit" variant="primary">
              {loading ? '処理中...' : 'アカウントを作成'}
            </Button>
          </div>

          {message && <p className="status-message">{message}</p>}

          <p className="signup-redirect-text">
            すでにアカウントをお持ちですか？{' '}
            <span className="signup-link" onClick={onNavigateToLogin}>
              ログインする
            </span>
          </p>
        </form>

      </main>
    </div>
  );
}