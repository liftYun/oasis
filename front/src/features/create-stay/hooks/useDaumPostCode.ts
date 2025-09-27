'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: any) => {
        open: () => void;
        embed: (container: HTMLElement) => void;
      };
    };
  }
}

export function useDaumPostcode() {
  const [loaded, setLoaded] = useState(false);

  // 📦 스크립트 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.daum?.Postcode) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 주소창 열기
  const openPostcode = useCallback(
    (onComplete: (data: any) => void) => {
      if (!loaded || !window.daum?.Postcode) {
        alert('주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      // PC: 기본 팝업
      if (window.innerWidth > 768) {
        new window.daum.Postcode({ oncomplete: onComplete }).open();
        return;
      }

      // 모바일: 풀스크린 모달 형태로 표시
      const wrapper = document.createElement('div');
      wrapper.id = 'daum-postcode-modal';
      wrapper.style.position = 'fixed';
      wrapper.style.top = '0';
      wrapper.style.left = '50%';
      wrapper.style.transform = 'translateX(-50%)';
      wrapper.style.width = '100%';
      wrapper.style.maxWidth = '480px';
      wrapper.style.height = '100vh';
      wrapper.style.background = '#fff';
      wrapper.style.zIndex = '9999';
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.border = '1px solid #f3f4f6';
      wrapper.style.borderTop = 'none';

      // BackHeader 스타일 복제
      const header = document.createElement('header');
      header.style.height = '56px';
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      header.style.padding = '0 8px';
      header.style.background = '#fff';
      header.style.borderBottom = '1px solid #f3f4f6';
      header.style.position = 'relative';
      header.style.zIndex = '10000';

      // 뒤로가기 버튼
      const backBtn = document.createElement('button');
      backBtn.style.padding = '8px';
      backBtn.style.border = 'none';
      backBtn.style.borderRadius = '9999px';
      backBtn.style.background = 'transparent';
      backBtn.style.display = 'flex';
      backBtn.style.alignItems = 'center';
      backBtn.style.justifyContent = 'center';
      backBtn.onclick = () => document.body.removeChild(wrapper);

      const backIcon = document.createElement('span');
      backIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>`;
      backBtn.appendChild(backIcon);

      // 타이틀
      const title = document.createElement('h1');
      title.textContent = '주소 검색';
      title.style.position = 'absolute';
      title.style.left = '50%';
      title.style.transform = 'translateX(-50%)';
      title.style.fontSize = '16px';
      title.style.fontWeight = '600';
      title.style.color = '#4b5563';

      header.appendChild(backBtn);
      header.appendChild(title);
      wrapper.appendChild(header);

      // 본문 컨테이너
      const container = document.createElement('div');
      container.id = 'postcode-container';
      container.style.flex = '1';
      wrapper.appendChild(container);

      document.body.appendChild(wrapper);

      // Daum 우편번호 임베드
      const postcode = new window.daum.Postcode({
        oncomplete: (data: any) => {
          onComplete(data);
          document.body.removeChild(wrapper);
        },
        onresize: (size: { height: number }) => {
          container.style.height = `${size.height}px`;
        },
        width: '100%',
        height: '100%',
      });

      postcode.embed(container);
    },
    [loaded]
  );

  return openPostcode;
}
