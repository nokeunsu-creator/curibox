import { useEffect, useRef } from 'react';

const GUARD_FLAG = '__curiboxBackGuard';

interface GuardState {
  [GUARD_FLAG]: true;
}

function isGuard(state: unknown): state is GuardState {
  return (
    typeof state === 'object' &&
    state !== null &&
    (state as { [GUARD_FLAG]?: unknown })[GUARD_FLAG] === true
  );
}

/**
 * Android(TWA) / 모바일 브라우저 뒤로가기를 인앱 네비게이션으로 가로챈다.
 *
 * - 마운트 시 history에 guard 상태를 push해두고 popstate를 리스닝
 * - back 누르면 handler 호출. true 반환 시 guard를 다시 push해 다음 back도 잡을 수 있게 함
 * - false 반환 시 popstate가 그대로 통과해 브라우저/앱 기본 동작(예: TWA 종료) 수행
 *
 * handler는 매 렌더의 최신 클로저를 ref로 잡아두어 effect 재실행 없이 사용
 */
export function useBackButton(handler: () => boolean) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isGuard(window.history.state)) {
      window.history.pushState({ [GUARD_FLAG]: true }, '');
    }

    const onPopState = () => {
      const handled = handlerRef.current();
      if (handled) {
        window.history.pushState({ [GUARD_FLAG]: true }, '');
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);
}
