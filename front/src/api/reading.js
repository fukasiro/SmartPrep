// src/api/reading.js (プロジェクトの構成に合わせて配置してください)

const BASE_URL = 'http://localhost:8000';

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