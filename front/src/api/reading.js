// src/api/reading.js

// .env からベースURLを取得（未定義の場合は localhost:8000 をフォールバックとし、末尾スラッシュを除去）
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

/**
 * 指定されたレベル（450, 600, 730, 860など）の読解コースデータをバックエンドから取得する
 * @param {number|string} level 
 * @returns {Promise<Array>} パッセージと設問のリスト
 */
export async function getReadingCourse(level) {
  try {
    const response = await fetch(`${BASE_URL}/reading/courses/${level}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`レベル ${level} のデータが見つかりませんでした。`);
      }
      throw new Error(`サーバーエラーが発生しました (Status: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Reading course fetch error: - reading.js:24', error);
    throw error;
  }
}