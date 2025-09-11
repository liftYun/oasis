import { useQuery } from '@tanstack/react-query';
import {
  AMENITIES_BY_CATEGORY,
  type AmenityCategoryKey,
  AMENITY_LABELS,
} from '@/features/create-stay/constants/amenities';
import { useLanguage } from '@/features/language';
import { createStayMessages } from '@/features/create-stay/locale';

export interface AmenitiesData {
  categoryLabels: Record<AmenityCategoryKey, string>;
  amenitiesByCategory: Record<AmenityCategoryKey, string[]>;
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
    amenitiesByCategory: Object.fromEntries(
      (Object.keys(AMENITIES_BY_CATEGORY) as AmenityCategoryKey[]).map((cat) => [
        cat,
        AMENITIES_BY_CATEGORY[cat].map((key) => AMENITY_LABELS[key][lang]),
      ])
    ) as Record<AmenityCategoryKey, string[]>,
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
