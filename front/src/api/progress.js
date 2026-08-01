import { loadCourseProgress as loadLocalCourseProgress, saveCourseProgress as saveLocalCourseProgress } from '../features/vocabulary/progressStorage';

const BASE_URL = 'http://127.0.0.1:8000';
const PROGRESS_PREFIX = '/progress';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getAuthToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem('eng_learning_access_token');
}

function getHeaders(includeJson = true) {
  const token = getAuthToken();
  const headers = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchCourseProgress(courseKey) {
  if (!isBrowser()) return {};

  const token = getAuthToken();
  if (!token) {
    return loadLocalCourseProgress(courseKey);
  }

  try {
    const response = await fetch(`${BASE_URL}${PROGRESS_PREFIX}/${encodeURIComponent(courseKey)}`, {
      method: 'GET',
      headers: getHeaders(false),
    });

    if (!response.ok) {
      console.warn(`Progress fetch failed with status ${response.status}. Falling back to localStorage.`);
      return loadLocalCourseProgress(courseKey);
    }

    const data = await response.json();
    return data?.progress ?? {};
  } catch (error) {
    console.error('Progress fetch error:', error);
    return loadLocalCourseProgress(courseKey);
  }
}

export async function saveCourseProgress(courseKey, progress) {
  if (!isBrowser()) return progress;

  const token = getAuthToken();
  if (!token) {
    saveLocalCourseProgress(courseKey, progress);
    return progress;
  }

  try {
    const response = await fetch(`${BASE_URL}${PROGRESS_PREFIX}/${encodeURIComponent(courseKey)}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ progress }),
    });

    if (!response.ok) {
      console.warn(`Progress save failed with status ${response.status}. Falling back to localStorage.`);
      saveLocalCourseProgress(courseKey, progress);
      return progress;
    }

    const data = await response.json();
    return data?.progress ?? progress;
  } catch (error) {
    console.error('Progress save error:', error);
    saveLocalCourseProgress(courseKey, progress);
    return progress;
  }
}
