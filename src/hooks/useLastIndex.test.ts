import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLastIndex } from './useLastIndex';

describe('useLastIndex', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts at 0 when no stored value', () => {
    const { result } = renderHook(() => useLastIndex(99));
    expect(result.current[0]).toBe(0);
  });

  it('restores stored value within range', () => {
    localStorage.setItem('curibox:lastIndex', '42');
    const { result } = renderHook(() => useLastIndex(99));
    expect(result.current[0]).toBe(42);
  });

  it('clamps stored value above maxIndex', () => {
    localStorage.setItem('curibox:lastIndex', '500');
    const { result } = renderHook(() => useLastIndex(99));
    expect(result.current[0]).toBe(99);
  });

  it('clamps negative stored value to 0', () => {
    localStorage.setItem('curibox:lastIndex', '-5');
    const { result } = renderHook(() => useLastIndex(99));
    expect(result.current[0]).toBe(0);
  });

  it('returns 0 when stored value is not a number', () => {
    localStorage.setItem('curibox:lastIndex', 'abc');
    const { result } = renderHook(() => useLastIndex(99));
    expect(result.current[0]).toBe(0);
  });

  it('clamps setIndex value to maxIndex', () => {
    const { result } = renderHook(() => useLastIndex(10));
    act(() => result.current[1](100));
    expect(result.current[0]).toBe(10);
  });

  it('clamps setIndex value above 0', () => {
    const { result } = renderHook(() => useLastIndex(10));
    act(() => result.current[1](-3));
    expect(result.current[0]).toBe(0);
  });
});
