export const stayDetailLocale = {
  kor: {
    common: {
      loading: '로딩 중...',
      loadError: '숙소 정보를 불러올 수 없습니다.',
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
  },

  eng: {
    common: {
      loading: 'Loading...',
      loadError: 'Unable to load stay information.',
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
  },
} as const;
