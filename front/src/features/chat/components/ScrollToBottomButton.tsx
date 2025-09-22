'use client';

import { useEffect, useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';

interface ScrollToBottomButtonProps {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  threshold?: number; // px 단위: 바닥에서 이 거리 이상 떨어져야 버튼 표시
  bottomSlack?: number; // px 단위: 바닥 근접 허용 오차(이 이하면 버튼 숨김)
}

export default function ScrollToBottomButton({
  anchorRef,
  threshold = 200,
  bottomSlack = 0,
}: ScrollToBottomButtonProps) {
  const [visible, setVisible] = useState(false);
  // 시간 지연 없이, 위치 기준 여유만 적용

  useEffect(() => {
    // 스크롤 가능한 조상 요소 탐색
    function getScrollableParent(el: HTMLElement | null): HTMLElement | null {
      let node: HTMLElement | null = el;
      while (node && node !== document.body) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const isScrollable = /(auto|scroll)/.test(overflowY);
        if (isScrollable && node.scrollHeight > node.clientHeight) return node;
        node = node.parentElement as HTMLElement | null;
      }
      return document.scrollingElement as HTMLElement | null;
    }

    const anchor = anchorRef.current as HTMLElement | null;
    const root = getScrollableParent(anchor);
    if (!root || !anchor) return;

    // 스크롤 이벤트 리스너를 추가해서 실시간으로 거리 계산
    let rafId: number | null = null;

    const checkVisibility = () => {
      // 스크롤 거리 계산(바닥까지 남은 거리)
      let distanceFromBottom: number;
      if (root === document.scrollingElement || root === document.documentElement) {
        const scrollY = window.scrollY || window.pageYOffset;
        distanceFromBottom = document.body.scrollHeight - (scrollY + window.innerHeight);
      } else {
        const rootEl = root as HTMLElement;
        distanceFromBottom = rootEl.scrollHeight - (rootEl.scrollTop + rootEl.clientHeight);
      }

      // 규칙: 바닥 근접 시 숨김, threshold 이상 떨어지면 표시
      if (distanceFromBottom <= (bottomSlack ?? 0)) {
        setVisible(false);
        return;
      }
      setVisible(distanceFromBottom >= (threshold ?? 0));
    };

    // 초기 체크
    checkVisibility();

    // 스크롤 이벤트 리스너
    const onScroll = () => {
      // 스크롤 중 레이아웃이 변할 수 있으므로 rAF로 묶어 측정 안정화
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkVisibility);
    };
    const onResize = () => checkVisibility();

    root.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions);
    window.addEventListener('resize', onResize);

    // DOM 변화 감지 (새 메시지 추가 등)
    const observer = new MutationObserver(checkVisibility);
    observer.observe(anchor.parentElement || document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      root.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [anchorRef, threshold, bottomSlack]);

  const scrollToBottom = () => {
    anchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToBottom}
      aria-label="scroll-to-bottom"
      className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-40 rounded-full bg-white/70 p-2 hover:bg-white/80"
    >
      <ArrowDownToLine className="w-7 h-7 text-gray-300" />
    </button>
  );
}
