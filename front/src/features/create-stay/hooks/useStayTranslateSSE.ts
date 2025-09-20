import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStores';
import { useStayStores } from '@/stores/useStayStores';
import type { StayTranslationResultDto } from '@/services/stay.types';

export function useStayTranslateSSE() {
  const stayStore = useStayStores();
  const authStore = useAuthStore();
  const nickname = authStore.nickname;

  useEffect(() => {
    if (!nickname) {
      return;
    }

    const es = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sse/connect/${nickname}`);

    // es.onopen = () => {
    //   console.log('SSE 연결 성공');
    // };

    // es.onerror = (err) => {
    //   console.error('SSE 에러', err);
    // };

    es.addEventListener('stayTranslate', (event) => {
      console.log('stayTranslate 이벤트 수신');
      const data: StayTranslationResultDto = JSON.parse((event as MessageEvent).data);
      console.log('번역결과 데이터:', data);
      stayStore.setField('addressDetailEng', data.detailAddress);
      stayStore.setField('titleEng', data.title);
      stayStore.setField('descriptionEng', data.content);
    });

    // return () => {
    //   console.log('SSE 연결 종료');
    //   es.close();
    // };
  }, [nickname]);
}
