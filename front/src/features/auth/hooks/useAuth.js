import { useState } from 'react';

// 環境変数からベースURLを取得（フォールバックは http://127.0.0.1:8000）
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

const TOKEN_STORAGE_KEY = 'eng_learning_access_token';
const USER_STORAGE_KEY = 'eng_learning_user';

function persistAuth(data) {
  if (data?.access_token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
  }
  if (data?.email || data?.name) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ email: data.email, name: data.name || null }));
  }
}

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        clearAuthStorage();
        const errorMsg = data.detail || data.message || 'ログインに失敗しました。パスワードをご確認ください。';
        setMessage(errorMsg);
        return { success: false, error: errorMsg };
      }

      persistAuth(data);
      setMessage(data.message || 'ログインに成功しました。');
      setUser({ email: data.email, name: data.name });
      return { success: true, data };
    } catch (error) {
      clearAuthStorage();
      const errorMsg = '通信エラーが発生しました。';
      setMessage(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async ({ name, email, password }) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.detail || data.message || 'アカウント作成に失敗しました。');
        return null;
      }

      setMessage(data.message);
      return data;
    } catch (error) {
      setMessage('サーバー接続に失敗しました。');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async ({ email, code }) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/verify-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.detail || data.message || '認証に失敗しました。');
        return null;
      }

      persistAuth(data);
      setMessage(data.message);
      setUser({ email: data.email, name: data.name });
      return data;
    } catch (error) {
      clearAuthStorage();
      setMessage('サーバー接続に失敗しました。');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.detail || data.message || 'リセットコードの送信に失敗しました。');
        return null;
      }

      setMessage(data.message || 'リセットコードを送信しました。');
      return data;
    } catch (error) {
      setMessage('サーバー接続に失敗しました。');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ email, code, new_password }) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/password-reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, new_password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.detail || data.message || 'パスワードの再設定に失敗しました。');
        return null;
      }

      setMessage(data.message || 'パスワードを再設定しました。');
      return data;
    } catch (error) {
      setMessage('サーバー接続に失敗しました。');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loginWithEmail, signUpWithEmail, verifyEmailCode, requestPasswordReset, resetPassword, loading, message, user };
}