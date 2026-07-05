import { describe, it, expect } from 'vitest';
import { getCurrentUserIdentifier, getCourseProgressStorageKey, loadCourseProgress } from './progressStorage';

describe('vocabulary progress storage', () => {
  it('uses a user-scoped storage key for authenticated users', () => {
    const storage = {
      getItem(key) {
        if (key === 'eng_learning_user') {
          return JSON.stringify({ email: 'Demo@Example.com', name: 'Demo' });
        }
        return null;
      },
      setItem() {},
      removeItem() {},
    };

    expect(getCurrentUserIdentifier(storage)).toBe('user:demo@example.com');
    expect(getCourseProgressStorageKey('vocab_450', storage)).toBe('vocab_450:user:demo@example.com');
  });

  it('falls back to guest scope when no user is logged in', () => {
    const storage = {
      getItem() { return null; },
      setItem() {},
      removeItem() {},
    };

    expect(getCurrentUserIdentifier(storage)).toBe('guest');
    expect(getCourseProgressStorageKey('vocab_450', storage)).toBe('vocab_450:guest');
  });

  it('ignores legacy course progress when a user is logged in without scoped data', () => {
    const storage = {
      getItem(key) {
        if (key === 'eng_learning_user') {
          return JSON.stringify({ name: 'Alice' });
        }
        if (key === 'vocab_450_stage_scores:guest') {
          return null;
        }
        if (key === 'vocab_450_stage_scores') {
          return JSON.stringify({ 0: 5 });
        }
        return null;
      },
      setItem() {},
      removeItem() {},
    };

    expect(loadCourseProgress('vocab_450_stage_scores', storage)).toEqual({});
  });
});
