import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import './VerifyCodeForm.css';

export default function VerifyCodeForm({ email, name, onVerifySuccess }) {
  const [code, setCode] = useState('');
  const { verifyEmailCode, loading, message } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !email) return;
    
    const result = await verifyEmailCode({ email, code });
    
    const isSuccess = result || (message && (message.includes('作成しました') || message.includes('成功')));
    
    if (isSuccess && onVerifySuccess) {
      const token = (result && typeof result === 'object' ? (result.token || result.data?.token) : null) 
                    || 'auto_login_token_after_verify';
      
      const userName = name || (result && typeof result === 'object' ? result.name : null) || email.split('@')[0];
      
      onVerifySuccess(token, userName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="verify-form">
      <div className="verify-header">
        <p className="verify-subtitle">
          {email} に送信された6桁の認証コードを入力してください。
        </p>
      </div>

      <div className="verify-alert">
        <p>コードは30分以内に有効です。届かない場合は迷惑メールフォルダを確認してください。</p>
      </div>

      <div className="form-input-group">
        <Input
          type="text"
          placeholder="認証コードを入力"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="verify-input"
        />
      </div>

      <div className="form-button-group">
        <Button type="submit" variant="primary">
          {loading ? '確認中...' : '認証してアカウントを作成'}
        </Button>
      </div>

      {message && !message.includes('作成しました') && !message.includes('成功') && (
        <p className="verify-message">{message}</p>
      )}
    </form>
  );
}