export type AmenityCategoryKey = 'bathroom' | 'bedroom' | 'kitchen' | 'convenience' | 'around';

export type AmenityOptionKey =
  | 'bath_bathtub'
  | 'bath_shower_booth'
  | 'bath_hair_dryer'
  | 'bath_shampoo'
  | 'bath_rinse'
  | 'bath_bodywash'
  | 'bath_towel'
  | 'bath_toothpaste_toothbrush'
  | 'bath_razor'
  | 'bed_single'
  | 'bed_double'
  | 'bed_twin'
  | 'bed_queen_king'
  | 'bed_sofabed'
  | 'bed_extra_bed_available'
  | 'bed_blackout_curtain'
  | 'kit_fridge'
  | 'kit_microwave'
  | 'kit_coffee_machine'
  | 'kit_stove'
  | 'kit_cookware_tableware'
  | 'kit_kettle'
  | 'kit_bottled_water'
  | 'conv_wifi'
  | 'conv_tv'
  | 'conv_ott'
  | 'conv_wardrobe_hanger'
  | 'conv_styler'
  | 'conv_washer'
  | 'conv_dryer'
  | 'conv_desk'
  | 'around_store_mart'
  | 'around_public_transport'
  | 'around_parking'
  | 'around_park';

export const AMENITY_LABELS: Record<AmenityOptionKey, { kor: string; eng: string }> = {
  bath_bathtub: { kor: '🛁 욕조', eng: '🛁 Bathtub' },
  bath_shower_booth: { kor: '🚿 샤워 부스', eng: '🚿 Shower booth' },
  bath_hair_dryer: { kor: '💨 드라이기', eng: '💨 Hair dryer' },
  bath_shampoo: { kor: '🧴 샴푸', eng: '🧴 Shampoo' },
  bath_rinse: { kor: '🧴 린스', eng: '🧴 Conditioner' },
  bath_bodywash: { kor: '🧼 바디워시', eng: '🧼 Body wash' },
  bath_towel: { kor: '💧 수건', eng: '💧 Towels' },
  bath_toothpaste_toothbrush: { kor: '🪥 치약/칫솔', eng: '🪥 Toothpaste & toothbrush' },
  bath_razor: { kor: '🪒 면도기', eng: '🪒 Razor' },
  bed_single: { kor: '🛏️ 싱글', eng: '🛏️ Single bed' },
  bed_double: { kor: '🛏️ 더블', eng: '🛏️ Double bed' },
  bed_twin: { kor: '🛏️ 트윈', eng: '🛏️ Twin beds' },
  bed_queen_king: { kor: '🛏️ 퀸/킹', eng: '🛏️ Queen/King bed' },
  bed_sofabed: { kor: '🛏️ 쇼파베드', eng: '🛏️ Sofa bed' },
  bed_extra_bed_available: { kor: '➕ 추가 침대 가능', eng: '➕ Extra bed available' },
  bed_blackout_curtain: { kor: '🌙 암막 커튼', eng: '🌙 Blackout curtains' },
  kit_fridge: { kor: '🧊 냉장고', eng: '🧊 Refrigerator' },
  kit_microwave: { kor: '🍲 전자레인지', eng: '🍲 Microwave' },
  kit_coffee_machine: { kor: '☕ 커피머신', eng: '☕ Coffee machine' },
  kit_stove: { kor: '🍳 인덕션/가스레인지', eng: '🍳 Stove/Induction' },
  kit_cookware_tableware: { kor: '🍴 조리도구/식기', eng: '🍴 Cookware & tableware' },
  kit_kettle: { kor: '♨️ 전기포트', eng: '♨️ Electric kettle' },
  kit_bottled_water: { kor: '💧 생수', eng: '💧 Bottled water' },
  conv_wifi: { kor: '📡 Wi-Fi', eng: '📡 Wi‑Fi' },
  conv_tv: { kor: '📺 TV', eng: '📺 TV' },
  conv_ott: { kor: '📺 OTT', eng: '📺 Streaming apps' },
  conv_wardrobe_hanger: { kor: '👕 옷장/행거', eng: '👕 Wardrobe & hangers' },
  conv_styler: { kor: '👔 스타일러', eng: '👔 Clothes styler' },
  conv_washer: { kor: '🧺 세탁기', eng: '🧺 Washer' },
  conv_dryer: { kor: '💨 건조기', eng: '💨 Dryer' },
  conv_desk: { kor: '📚 책상', eng: '📚 Desk' },
  around_store_mart: { kor: '🏪 편의점/마트', eng: '🏪 Convenience store/Mart' },
  around_public_transport: { kor: '🚏 대중교통', eng: '🚏 Public transport' },
  around_parking: { kor: '🅿️ 주차장', eng: '🅿️ Parking' },
  around_park: { kor: '🌳 공원', eng: '🌳 Park' },
};

export const AMENITIES_BY_CATEGORY: Record<AmenityCategoryKey, AmenityOptionKey[]> = {
  bathroom: [
    'bath_bathtub',
    'bath_shower_booth',
    'bath_hair_dryer',
    'bath_shampoo',
    'bath_rinse',
    'bath_bodywash',
    'bath_towel',
    'bath_toothpaste_toothbrush',
    'bath_razor',
  ],
  bedroom: [
    'bed_single',
    'bed_double',
    'bed_twin',
    'bed_queen_king',
    'bed_sofabed',
    'bed_extra_bed_available',
    'bed_blackout_curtain',
  ],
  kitchen: [
    'kit_fridge',
    'kit_microwave',
    'kit_coffee_machine',
    'kit_stove',
    'kit_cookware_tableware',
    'kit_kettle',
    'kit_bottled_water',
  ],
  convenience: [
    'conv_wifi',
    'conv_tv',
    'conv_ott',
    'conv_wardrobe_hanger',
    'conv_styler',
    'conv_washer',
    'conv_dryer',
    'conv_desk',
  ],
  around: ['around_store_mart', 'around_public_transport', 'around_parking', 'around_park'],
};

export type AmenitiesSelection = Partial<Record<AmenityCategoryKey, AmenityOptionKey[]>>;

export const getAmenityLabel = (key: AmenityOptionKey, lang: 'kor' | 'eng') =>
  AMENITY_LABELS[key][lang];
