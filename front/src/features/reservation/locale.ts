export const reservationMessages = {
  kor: {
    header: {
      title: '숙소 예약하기',
    },
    step1: {
      datePlaceholder: '날짜를 선택하세요',
      next: '다음',
      nights: (n: number) => `${n}박`,
      guide: '체크인/체크아웃 날짜를 선택해주세요. (최소 2박, 최대 30박)',
    },
    step2: {
      title: '게스트 정보 입력 (더미)',
      next: '다음',
    },
    step3: {
      title: '결제 확인 (더미)',
      submit: '예약 요청',
    },
  },
  eng: {
    header: { title: 'Make a reservation' },
    step1: {
      datePlaceholder: 'Select dates',
      next: 'Next',
      nights: (n: number) => `${n} nights`,
      guide: 'Choose check-in/check-out. (min 2 nights, max 30)',
    },
    step2: { title: 'Guest info (dummy)', next: 'Next' },
    step3: { title: 'Payment (dummy)', submit: 'Request' },
  },
} as const;

export type ReservationLocale = typeof reservationMessages;
