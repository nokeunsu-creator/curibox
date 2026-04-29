import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    mockMatchMedia(false);
  });

  it('defaults to system mode', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('resolves system mode to light when prefers-color-scheme is light', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('resolves system mode to dark when prefers-color-scheme is dark', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.resolvedTheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('forces light when set explicitly', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));
    expect(result.current.resolvedTheme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('forces dark when set explicitly', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));
    expect(result.current.resolvedTheme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));
    expect(localStorage.getItem('curibox:theme')).toBe('dark');
    act(() => result.current.setTheme('light'));
    expect(localStorage.getItem('curibox:theme')).toBe('light');
    act(() => result.current.setTheme('system'));
    expect(localStorage.getItem('curibox:theme')).toBe('system');
  });

  it('falls back to system when stored value is invalid', () => {
    localStorage.setItem('curibox:theme', 'pumpkin');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });
});
