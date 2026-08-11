import { useState } from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useAuth } from '../hooks/useAuth'; 
import './LoginForm.css'; 

export default function LoginForm({ onNavigateToLanding, onNavigateToSignUp, onNavigateToForgotPassword, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // useAuth フックを使用
  const { loginWithEmail, loading, message } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    // useAuth の loginWithEmail 経由でログイン実行
    const result = await loginWithEmail(email, password);

    if (result && result.success) {
      if (onLoginSuccess) {
        // useAuth から返ってきた値、または入力された値を渡すだけ（トークン抽出などは不要）
        const name = result.data?.name || email.split('@')[0];
        const userEmail = result.data?.email || email;

        onLoginSuccess(name, userEmail);
      }
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

          <p className="forgot-password-text">
            <span className="forgot-password-link" onClick={onNavigateToForgotPassword}>
              パスワード再設定
            </span>
          </p>

          <div className="form-button-group">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? '処理中...' : 'ログイン'}
            </Button>
          </div>

          <p className="signup-redirect-text">
            アカウントをお持ちでないですか？{' '}
            <span className="signup-link" onClick={onNavigateToSignUp}>
              登録する
            </span>
          </p>

          {message && <p className="status-message" style={{ color: '#ff4d4f', textAlign: 'center', marginTop: '10px' }}>{message}</p>}
        </form>

        <button 
          type="button" 
          className="skip-btn" 
          onClick={() => onLoginSuccess && onLoginSuccess(null, 'ゲストユーザー', 'guest@example.com')}
        >
          ログインせずに始める 🚀
        </button>
        
        <p className="legal-text">
          ログインすると利用規約とプライバシーポリシーに同意したことになります。
        </p>

      </main>
    </div>
  );
}