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
      searchPlaceholder: '스마트 키를 등록할 닉네임을 검색하세요.',
      successMessage: '스마트 키 등록이 완료되었습니다.',
      failMessage: '닉네임을 찾을 수 없습니다.',
      promo: [
        {
          title: '스마트 키는 한번 등록하면\n변경할 수 없습니다.',
          caption: '안전하게 보관되며, 이후 수정·삭제 불가능',
        },
        {
          title: '하나의 키로\n여러 이용자가 공유할 수 있습니다!',
          caption: '스마트 컨트랙트 기반 검증',
        },
      ],
    },
    step3: {
      title: '결제 사항 검토',
      description: '보유 잔액과 유의사항을 반드시 확인해주세요!',
      submit: '예약하기',
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
    step2: {
      title: 'Guest info (dummy)',
      next: 'Next',
      searchPlaceholder: 'Search a nickname to register smart key',
      successMessage: 'Smart key registration completed.',
      failMessage: 'Nickname not found.',
      promo: [
        {
          title: 'Once registered,\nthe smart key cannot be changed.',
          caption: 'Safely stored; editing/deletion is not allowed',
        },
        {
          title: 'One key can be shared\namong multiple users!',
          caption: 'Verified by smart contracts',
        },
      ],
    },
    step3: {
      title: 'Payment Review',
      description: 'Please check your balance and notes carefully!',
      submit: 'Book',
    },
  },
} as const;

export type ReservationLocale = typeof reservationMessages;
