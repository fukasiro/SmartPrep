// front/src/features/auth/components/LoginForm.jsx
import { useState } from 'react';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import './LoginForm.css'; 

export default function LoginForm({ onNavigateToLanding, onNavigateToSignUp, onNavigateToForgotPassword, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setMessage('');

    try {
      // 💡 useAuth を介さず、確実にバックエンドの /login エンドポイントを叩きます
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'ログインに失敗しました。パスワードをご確認ください。');
      }

      // 💡 バックエンドから返ってきた正しい情報をそのまま親に引き渡します
      if (onLoginSuccess) {
        const token = data.access_token;
        const name = data.name || email.split('@')[0];
        const userEmail = data.email || email;
        
        onLoginSuccess(token, name, userEmail);
      }

    } catch (err) {
      setMessage(err instanceof Error ? err.message : '通信エラーが発生しました。');
    } finally {
      setLoading(false);
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