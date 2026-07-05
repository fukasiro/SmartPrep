const TOKEN_STORAGE_KEY = 'eng_learning_access_token';
const USER_STORAGE_KEY = 'eng_learning_user';
const GUEST_USER_ID = 'guest';

function notifyProgressStorageChanged(storage = globalThis.localStorage) {
  if (!storage || typeof window === 'undefined') return;
  window.dispatchEvent(new Event('vocab-progress-storage-updated'));
}

function normalizeUserId(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

export function getCurrentUserIdentifier(storage = globalThis.localStorage) {
  if (!storage) return GUEST_USER_ID;

  const savedUserRaw = storage.getItem(USER_STORAGE_KEY);
  if (savedUserRaw) {
    try {
      const savedUser = JSON.parse(savedUserRaw);
      const email = normalizeUserId(savedUser?.email);
      if (email) return `user:${email}`;

      const name = normalizeUserId(savedUser?.name);
      if (name) return `user:${name}`;
    } catch (error) {
      console.error(error);
    }
  }

  const token = storage.getItem(TOKEN_STORAGE_KEY);
  if (token) return 'user:authenticated';

  return GUEST_USER_ID;
}

export function getCourseProgressStorageKey(courseKey, storage = globalThis.localStorage) {
  return `${courseKey}:${getCurrentUserIdentifier(storage)}`;
}

export function loadCourseProgress(courseKey, storage = globalThis.localStorage) {
  if (!storage) return {};

  const scopedKey = getCourseProgressStorageKey(courseKey, storage);
  const scopedRaw = storage.getItem(scopedKey);
  if (scopedRaw) {
    try {
      return JSON.parse(scopedRaw);
    } catch (error) {
      console.error(error);
    }
  }

  return {};
}

export function saveCourseProgress(courseKey, progress, storage = globalThis.localStorage) {
  if (!storage) return;
  storage.setItem(getCourseProgressStorageKey(courseKey, storage), JSON.stringify(progress));
  notifyProgressStorageChanged(storage);
}

export function clearCourseProgress(courseKey, storage = globalThis.localStorage) {
  if (!storage) return;
  storage.removeItem(getCourseProgressStorageKey(courseKey, storage));
  storage.removeItem(courseKey);
  notifyProgressStorageChanged(storage);
}
