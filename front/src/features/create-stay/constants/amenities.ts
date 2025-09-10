export type AmenityCategoryKey = 'bathroom' | 'bedroom' | 'kitchen' | 'convenience' | 'around';

export const AMENITY_CATEGORY_LABELS: Record<AmenityCategoryKey, string> = {
  bathroom: '욕실',
  bedroom: '침실',
  kitchen: '주방',
  convenience: '편의',
  around: '주변',
};

export const AMENITIES_BY_CATEGORY: Record<AmenityCategoryKey, string[]> = {
  bathroom: [
    '🛁 욕조',
    '🚿 샤워 부스',
    '💨 드라이기',
    '🧴 샴푸',
    '🧴 린스',
    '🧼 바디워시',
    '💧 수건',
    '🪥 치약/칫솔',
    '🪒 면도기',
  ],
  bedroom: [
    '🛏️ 싱글',
    '🛏️ 더블',
    '🛏️ 트윈',
    '🛏️ 퀸/킹',
    '🛏️ 쇼파베드',
    '➕ 추가 침대 가능',
    '🌙 암막 커튼',
  ],
  kitchen: [
    '🧊 냉장고',
    '🍲 전자레인지',
    '☕ 커피머신',
    '🍳 인덕션/가스레인지',
    '🍴 조리도구/식기',
    '♨️ 전기포트',
    '💧 생수',
  ],
  convenience: [
    '📡 Wi-Fi',
    '📺 TV',
    '📺 OTT',
    '👕 옷장/행거',
    '👔 스타일러',
    '🧺 세탁기',
    '💨 건조기',
    '📚 책상',
  ],
  around: ['🏪 편의점/마트', '🚏 대중교통', '🅿️ 주차장', '🌳 공원'],
};

export type AmenitiesSelection = Partial<Record<AmenityCategoryKey, string[]>>;
