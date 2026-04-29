import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { useBackButton } from './useBackButton';

describe('useBackButton', () => {
  let pushSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    window.history.replaceState(null, '');
    pushSpy = vi.spyOn(window.history, 'pushState');
  });

  afterEach(() => {
    cleanup();
    pushSpy.mockRestore();
  });

  it('pushes a guard state on mount', () => {
    renderHook(() => useBackButton(() => false));
    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith(
      expect.objectContaining({ __curiboxBackGuard: true }),
      ''
    );
  });

  it('does not double-push when guard already present', () => {
    window.history.replaceState({ __curiboxBackGuard: true }, '');
    pushSpy.mockClear();
    renderHook(() => useBackButton(() => false));
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it('invokes handler on popstate', () => {
    const handler = vi.fn(() => false);
    renderHook(() => useBackButton(handler));
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('re-pushes guard when handler returns true', () => {
    renderHook(() => useBackButton(() => true));
    pushSpy.mockClear();
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(pushSpy).toHaveBeenCalledTimes(1);
  });

  it('does not re-push when handler returns false', () => {
    renderHook(() => useBackButton(() => false));
    pushSpy.mockClear();
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it('uses latest handler closure each popstate', () => {
    let counter = 0;
    const { rerender } = renderHook(
      ({ inc }: { inc: number }) =>
        useBackButton(() => {
          counter += inc;
          return false;
        }),
      { initialProps: { inc: 1 } }
    );
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(counter).toBe(1);
    rerender({ inc: 10 });
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(counter).toBe(11);
  });
});
