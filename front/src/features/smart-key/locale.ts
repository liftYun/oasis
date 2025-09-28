export const messages = {
  kor: {
    title: '스마트 키',
    descriptionTitle: '블록체인으로 보장된 키',
    description: '모바일로 안전하게 문을 열고 닫을 수 있어요!',
    guide: '새로운 숙소를 예약해보세요.\n스마트 키가 자동으로 발급됩니다.',
    button: '숙소 예약하기',
    tooltip: {
      main: '지금 바로 숙소를 예약해보세요!',
      sub: '블록체인 보안으로 안전하게 발급됩니다.',
    },
    empty: {
      title: '등록된 스마트 키가 없습니다.',
      sub: '숙소를 예약하면 스마트 키가 자동으로 발급됩니다.',
    },
    card: {
      openDoor: '문 열기',
      doorOpened: '문이 열렸습니다!',
      doorOpenFailed: '문 열기에 실패했습니다.',
      doorOpenError: '문 열기 요청 중 오류가 발생했습니다.',
      description: '이 키는 호스트가 발급한 스마트 키입니다.\n문 열기 버튼을 눌러 출입하세요.',
      host: '호스트',
      seeMore: '자세히 보기',
      chatStart: '채팅 시작하기',
      activationTime: '활성화 시간',
      expirationTime: '만료 시간',
    },
    host: {
      chatStart: '채팅 시작하기',
    },
    toast: {
      checkingLogin: '로그인을 확인 중입니다.',
      needLogin: '로그인이 필요합니다.',
      noStay: '숙소 정보를 불러오지 못했습니다.',
      invalidHost: '유효하지 않은 호스트 정보입니다.',
      chatEnterFailed: '채팅방 입장에 실패했습니다. 다시 시도해주세요.',
    },
  },
  eng: {
    title: 'Smart Key',
    descriptionTitle: 'Blockchain-secured Key',
    description: 'Lock and unlock your room with your phone.',
    guide: 'Book a stay.\nYour smart key is issued instantly.',
    button: 'Book Now',
    tooltip: {
      main: 'Book your stay right now!',
      sub: 'Securely issued with Blockchain.',
    },
    empty: {
      title: 'No smart key registered.',
      sub: 'Book a stay and your smart key will be issued instantly.',
    },
    card: {
      openDoor: 'Open Door',
      doorOpened: 'The door has been opened!',
      doorOpenFailed: 'Failed to open the door.',
      doorOpenError: 'An error occurred while trying to open the door.',
      description: 'This key was issued by the host.\nPress the Open Door button to enter.',
      host: 'Host',
      seeMore: 'See Details',
      chatStart: 'Start Chat',
      activationTime: 'Activation Time',
      expirationTime: 'Expiration Time',
    },
    host: {
      chatStart: 'Start Chat',
    },
    toast: {
      checkingLogin: 'Checking login status...',
      needLogin: 'Login required.',
      noStay: 'Failed to load stay information.',
      invalidHost: 'Invalid host information.',
      chatEnterFailed: 'Failed to enter chat room. Please try again.',
    },
  },
} as const;

export type Messages = typeof messages;
