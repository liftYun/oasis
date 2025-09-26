import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: any) => { open: () => void };
    };
  }
}

export function useDaumPostcode() {
  const [loaded, setLoaded] = useState(false);

  // 스크립트 로드
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

  const openPostcode = useCallback(
    (onComplete: (data: any) => void) => {
      if (!loaded || !window.daum?.Postcode) {
        alert('주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      new window.daum.Postcode({
        oncomplete: onComplete,
      }).open();
    },
    [loaded]
  );

  return openPostcode;
}
