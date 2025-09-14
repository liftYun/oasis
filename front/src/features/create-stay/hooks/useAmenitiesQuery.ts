import { useQuery } from '@tanstack/react-query';
import {
  AMENITIES_BY_CATEGORY,
  type AmenityCategoryKey,
  AMENITY_LABELS,
  type AmenityOptionKey,
} from '@/features/create-stay/constants/amenities';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export interface AmenitiesData {
  categoryLabels: Record<AmenityCategoryKey, string>;
  // 카테고리별 옵션 ID 배열
  amenityIdsByCategory: Record<AmenityCategoryKey, AmenityOptionKey[]>;
  // ID -> 라벨 맵 (현재 언어)
  amenityLabels: Record<AmenityOptionKey, string>;
}

const buildAmenities = (lang: 'kor' | 'eng'): AmenitiesData => {
  const t = createStayMessages[lang];
  return {
    categoryLabels: {
      bathroom: t.categories.bathroom,
      bedroom: t.categories.bedroom,
      kitchen: t.categories.kitchen,
      convenience: t.categories.convenience,
      around: t.categories.around,
    },
    amenityIdsByCategory: AMENITIES_BY_CATEGORY,
    amenityLabels: Object.fromEntries(
      (Object.keys(AMENITY_LABELS) as AmenityOptionKey[]).map((key) => [
        key,
        AMENITY_LABELS[key][lang],
      ])
    ) as Record<AmenityOptionKey, string>,
  };
};

export function useAmenitiesQuery() {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ['amenities', lang],
    queryFn: () => Promise.resolve(buildAmenities(lang)),
    staleTime: 1000 * 60 * 60, // 1h
  });
}
