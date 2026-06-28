import { useState } from 'react';

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
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        clearAuthStorage();
        setMessage(data.detail || data.message || 'ログインに失敗しました。');
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

  const signUpWithEmail = async ({ name, email, password }) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/signup', {
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
      const response = await fetch('http://127.0.0.1:8000/verify-signup', {
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

  return { loginWithEmail, signUpWithEmail, verifyEmailCode, loading, message, user };
}
