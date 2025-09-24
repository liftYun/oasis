import type { Lang } from '@/types/lang';

export const stayDetailLocale = {
  kor: {
    common: {
      loading: '로딩 중...',
      loadError: '숙소 정보를 불러올 수 없습니다.',
      editStay: '숙소 정보 수정하기',
      back: '돌아가기',
      edit: '수정하기',
      delete: '삭제하기',
      deleteStay: '숙소 삭제하기',
      deleteConfirm: '정말 이 숙소를 삭제하시겠습니까?',
      deleteSuccess: '숙소가 성공적으로 삭제되었습니다.',
      deleteError: '숙소 삭제 중 오류가 발생했습니다.',
      checkingLogin: '로그인 정보를 확인 중입니다. 잠시만 기다려주세요.',
      loginRequired: '로그인이 필요합니다. 회원가입/로그인을 진행해 주세요.',
      stayLoadFailRetry: '숙소 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      invalidHostInfo: '호스트 정보가 올바르지 않습니다.',
      chatEnterFailRetry: '채팅방 진입에 실패했어요. 잠시 후 다시 시도해 주세요.',
      cancel: '예약 취소하기',
      cancelConfirm: '정말 예약을 취소하시겠습니까?',
      cancelSuccess: '예약 취소가 완료되었습니다.',
      cancelError: '예약 취소 중 오류가 발생했습니다.',
      walletButton: '지갑 연결하기',
      walletRequired: '예약을 취소하기 전에 지갑을 연결해주세요.',
    },
    detail: {
      infoTitle: '숙소 세부정보',
      facilitiesTitle: '숙소 편의시설',
      mapTitle: '숙소 위치',
      reviewsTitle: '숙소 리뷰',
      hostTitle: '호스트 정보',
      regionSeparator: '·',
    },
    description: {
      more: '더보기',
      close: '닫기',
      maxGuests: (count: number) => `최대 ${count}명 숙박 가능`,
    },
    review: {
      avgTitle: '숙소 평균 리뷰',
      aiSummaryTitle: '숙소 리뷰 AI 요약',
      tip: '리뷰를 한눈에 확인해볼 수 있어요!',
      highSummary: '↑ 높은 평점 요약',
      lowSummary: '↓ 낮은 평점 요약',
      ratingUnit: '점',
      seeAll: '전체 리뷰 보기',
      reviewsNot: '리뷰가 없습니다.',
    },
    host: {
      hostName: '호스트',
      chatStart: '채팅 시작하기',
    },
    booking: {
      reserve: '예약하기',
      perNight: '1박당',
    },
    facilities: {
      BATHROOM: '욕실',
      BEDROOM: '침실',
      KITCHEN: '주방',
      AMENITY: '편의',
      SERVICE: '주변',
    },
    reservation: {
      reservationDetail: '예약 세부정보',
      checkin: '체크인',
      checkout: '체크아웃',
      smartKey: '스마트 키',
      participants: '명',
      payment: '결제한 금액',
    },
  },

  eng: {
    common: {
      loading: 'Loading...',
      loadError: 'Unable to load stay information.',
      editStay: 'Edit Stay Information',
      edit: 'Edit',
      back: 'Back',
      delete: 'Delete',
      deleteStay: 'Delete Stay',
      deleteConfirm: 'Are you sure you want to delete this stay?',
      deleteSuccess: 'The stay has been successfully deleted.',
      deleteError: 'An error occurred while deleting the stay.',
      checkingLogin: 'Checking login info. Please wait a moment.',
      loginRequired: 'Login required. Please sign up or log in.',
      stayLoadFailRetry: 'Failed to load stay info. Please try again later.',
      invalidHostInfo: 'Host information is invalid.',
      chatEnterFailRetry: 'Failed to enter the chat. Please try again later.',
      cancel: 'Cancel Reservation',
      cancelConfirm: 'Are you sure you want to cancel this reservation?',
      cancelSuccess: 'Your reservation has been successfully cancelled.',
      cancelError: 'An error occurred while cancelling the reservation.',
      walletButton: 'Connect Wallet',
      walletRequired: 'Please connect your wallet to cancel the reservation.',
    },
    detail: {
      infoTitle: 'Stay Details',
      facilitiesTitle: 'Stay Facilities',
      mapTitle: 'Stay Location',
      reviewsTitle: 'Stay Reviews',
      hostTitle: 'Host Information',
      regionSeparator: '·',
    },
    description: {
      more: 'Read More',
      close: 'Close',
      maxGuests: (count: number) => `Up to ${count} guests allowed`,
    },
    review: {
      avgTitle: 'Stay Average Review',
      aiSummaryTitle: 'Stay Review AI Summary',
      tip: 'Easily check all reviews at a glance!',
      highSummary: '↑ High Rating Summary',
      lowSummary: '↓ Low Rating Summary',
      ratingUnit: 'points',
      seeAll: 'See All Reviews',
      reviewsNot: 'No reviews yet.',
    },
    host: {
      hostName: 'Host',
      chatStart: 'Start Chat',
    },
    booking: {
      reserve: 'Book Now',
      perNight: 'per night',
    },
    facilities: {
      BATHROOM: 'Bathroom',
      BEDROOM: 'Bedroom',
      KITCHEN: 'Kitchen',
      AMENITY: 'Amenities',
      SERVICE: 'Nearby',
    },
    reservation: {
      reservationDetail: 'Reservation Details',
      checkin: 'Check-in',
      checkout: 'Check-out',
      smartKey: 'Smart Key',
      participants: 'guests',
      payment: 'Payment Amount',
    },
  },
} as const satisfies Record<
  Lang,
  {
    common: {
      loading: string;
      loadError: string;
      editStay: string;
      back: string;
      edit: string;
      delete: string;
      deleteStay: string;
      deleteConfirm: string;
      deleteSuccess: string;
      deleteError: string;
      checkingLogin: string;
      loginRequired: string;
      stayLoadFailRetry: string;
      invalidHostInfo: string;
      chatEnterFailRetry: string;
      cancel: string;
      cancelConfirm: string;
      cancelSuccess: string;
      cancelError: string;
      walletButton: string;
      walletRequired: string;
    };
    detail: {
      infoTitle: string;
      facilitiesTitle: string;
      mapTitle: string;
      reviewsTitle: string;
      hostTitle: string;
      regionSeparator: string;
    };
    description: {
      more: string;
      close: string;
      maxGuests: (count: number) => string;
    };
    review: {
      avgTitle: string;
      aiSummaryTitle: string;
      tip: string;
      highSummary: string;
      lowSummary: string;
      ratingUnit: string;
      seeAll: string;
      reviewsNot: string;
    };
    host: {
      hostName: string;
      chatStart: string;
    };
    booking: {
      reserve: string;
      perNight: string;
    };
    facilities: {
      BATHROOM: string;
      BEDROOM: string;
      KITCHEN: string;
      AMENITY: string;
      SERVICE: string;
    };
    reservation: {
      reservationDetail: string;
      checkin: string;
      checkout: string;
      smartKey: string;
      participants: string;
      payment: string;
    };
  }
>;
