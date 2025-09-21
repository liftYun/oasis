import { se } from 'date-fns/locale';

export const reservationMessages = {
  kor: {
    header: {
      title: '숙소 예약하기',
    },
    step1: {
      datePlaceholder: '날짜를 선택하세요.',
      next: '다음',
      nights: (n: number) => `${n}박`,
      guide: '체크인/체크아웃 날짜를 선택해주세요. (최소 1박, 최대 29박)',
    },
    step2: {
      title: '스마트키 사용자를 선택해주세요.',
      next: '다음',
      searchPlaceholder: '스마트 키를 등록할 닉네임을 검색하세요.',
      successMessage: '스마트 키 등록이 완료되었습니다.',
      searchMessage: '스마트 키를 등록할 유저를 선택해주세요.',
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
      topUp: '충전하기',
      summaryTitle: '숙소 결제 금액',
      notesTitle: '결제 유의사항',
      labels: {
        nights: '숙박 일자',
        fee: '수수료',
      },
      notes: [
        '모든 결제는 블록체인 스마트컨트랙트로 안전하게 처리됩니다.',
        '예약 및 결제 내역은 블록체인에 기록되어 위·변조가 불가능합니다.',
        '취소 및 환불은 숙소 정책 및 스마트컨트랙트 규정에 따릅니다.',
        '결제 시 네트워크 수수료(Gas Fee)가 추가로 발생할 수 있습니다.',
        '결제 전 반드시 지갑 잔액을 확인해주세요.',
        '결제 완료 시 예약이 자동 확정되며 별도의 승인 절차가 필요하지 않습니다.',
        '거래 내역은 영구적으로 기록되어 언제든 조회·검증 가능합니다.',
        '네트워크 혼잡 시 결제 처리에 일시적 지연이 발생할 수 있습니다.',
      ],
    },
  },
  eng: {
    header: { title: 'Make a reservation' },
    step1: {
      datePlaceholder: 'Select dates',
      next: 'Next',
      nights: (n: number) => `${n} nights`,
      guide: 'Choose check-in/check-out. (min 1 night, max 29 nights)',
    },
    step2: {
      title: 'Select a smart key user',
      next: 'Next',
      searchPlaceholder: 'Search a nickname to register smart key',
      successMessage: 'Smart key registration completed.',
      searchMessage: 'Select a user to register smart key.',
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
      topUp: 'Top up',
      summaryTitle: 'Payment Summary',
      notesTitle: 'Payment Notes',
      labels: {
        nights: 'Nights',
        fee: 'Fee',
      },
      notes: [
        'All payments are securely processed via blockchain smart contracts.',
        'Reservation and payment records are stored on the blockchain and cannot be tampered with.',
        'Cancellations and refunds follow the accommodation policy and smart contract rules.',
        'Network fees (Gas Fee) may be additionally charged.',
        'Please check your wallet balance before payment.',
        'Once the payment is completed, the reservation is automatically confirmed and no separate approval is required.',
        'Transaction history is permanently recorded and can be viewed and verified at any time.',
        'In case of network congestion, there may be a temporary delay in processing the payment.',
      ],
    },
  },
} as const;

export type ReservationLocale = typeof reservationMessages;
