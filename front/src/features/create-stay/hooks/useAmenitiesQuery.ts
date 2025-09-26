import { useQuery } from '@tanstack/react-query';
import {
  AMENITIES_BY_CATEGORY,
  AMENITY_LABELS,
  AMENITY_KEY_TO_ID,
  type AmenityCategoryKey,
  type AmenityOptionKey,
} from '@/features/create-stay/constants/amenities';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export interface AmenitiesData {
  categoryLabels: Record<AmenityCategoryKey, string>;
  amenityIdsByCategory: Record<AmenityCategoryKey, number[]>;
  amenityLabels: Record<number, string>;
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
    amenityIdsByCategory: Object.fromEntries(
      Object.entries(AMENITIES_BY_CATEGORY).map(([cat, keys]) => [
        cat,
        keys.map((k) => AMENITY_KEY_TO_ID[k as AmenityOptionKey]),
      ])
    ) as Record<AmenityCategoryKey, number[]>,
    amenityLabels: Object.fromEntries(
      Object.entries(AMENITY_LABELS).map(([key, value]) => [
        AMENITY_KEY_TO_ID[key as AmenityOptionKey],
        value[lang],
      ])
    ) as Record<number, string>,
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
