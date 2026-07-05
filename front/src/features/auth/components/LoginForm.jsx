// front/src/features/auth/components/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import './LoginForm.css'; 

export default function LoginForm({ onNavigateToLanding, onNavigateToSignUp, onNavigateToForgotPassword, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithEmail, loading, message } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const result = await loginWithEmail(email, password);
    
    if (result && onLoginSuccess) {
      const token = result.token || 'dummy_token';
      const name = result.name || email.split('@')[0];
      onLoginSuccess(token, name, result.email || email);
    }
  };

  return (
    <div className="auth-page-container">
      <main className="main-content-card">
        
        {/* ホームに戻るボタン */}
        <button className="back-to-home-btn" onClick={onNavigateToLanding}>
          ← ホームに戻る
        </button>

        <h1 className="page-title">ログイン</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-input-group">
            <Input
              type="email"
              placeholder="Eメールまたはユーザー名"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-input-group">
            <Input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-button-group">
            <Button type="submit" variant="primary">
              {loading ? '処理中...' : 'ログイン'}
            </Button>
          </div>

          <p className="signup-redirect-text">
            アカウントをお持ちでないですか？{' '}
            <span className="signup-link" onClick={onNavigateToSignUp}>
              登録する
            </span>
          </p>
          <p className="forgot-password-text">
            <span className="forgot-password-link" onClick={onNavigateToForgotPassword}>
              パスワードを忘れた場合
            </span>
          </p>

          {message && <p className="status-message">{message}</p>}
        </form>

        <button 
          type="button" 
          className="skip-btn" 
          onClick={() => onLoginSuccess && onLoginSuccess(null, 'ゲストユーザー')}
        >
          ログインせずに始める 🚀
        </button>
        
        <div className="auth-divider"><span>または</span></div>
        
        <p className="legal-text">
          ログインすると利用規約とプライバシーポリシーに同意したことになります。
        </p>

      </main>
    </div>
  );
}