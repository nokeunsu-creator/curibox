import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from './useFavorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty when no stored value', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.count).toBe(0);
    expect(result.current.favorites.size).toBe(0);
  });

  it('toggles a favorite on and off', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => result.current.toggleFavorite(7));
    expect(result.current.isFavorite(7)).toBe(true);
    expect(result.current.count).toBe(1);

    act(() => result.current.toggleFavorite(7));
    expect(result.current.isFavorite(7)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('clears all favorites', () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggleFavorite(1);
      result.current.toggleFavorite(2);
      result.current.toggleFavorite(3);
    });
    expect(result.current.count).toBe(3);

    act(() => result.current.clearFavorites());
    expect(result.current.count).toBe(0);
  });

  it('restores from localStorage on init', () => {
    localStorage.setItem('curibox:favorites', JSON.stringify([10, 20, 30]));
    const { result } = renderHook(() => useFavorites());
    expect(result.current.count).toBe(3);
    expect(result.current.isFavorite(20)).toBe(true);
    expect(result.current.isFavorite(99)).toBe(false);
  });

  it('ignores non-number entries in stored value', () => {
    localStorage.setItem(
      'curibox:favorites',
      JSON.stringify([1, 'foo', null, 2])
    );
    const { result } = renderHook(() => useFavorites());
    expect(result.current.count).toBe(2);
    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(2)).toBe(true);
  });

  it('returns empty when stored value is malformed', () => {
    localStorage.setItem('curibox:favorites', 'not json');
    const { result } = renderHook(() => useFavorites());
    expect(result.current.count).toBe(0);
  });
});
