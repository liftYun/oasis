import { useQuery } from '@tanstack/react-query';
import {
  AMENITY_CATEGORY_LABELS,
  AMENITIES_BY_CATEGORY,
  type AmenityCategoryKey,
} from '@/features/create-stay/constants/amenities';

export interface AmenitiesData {
  categoryLabels: Record<AmenityCategoryKey, string>;
  amenitiesByCategory: Record<AmenityCategoryKey, string[]>;
}

const fetchAmenities = async (): Promise<AmenitiesData> => {
  // 서버 연동 전까지는 상수로 제공하지만, React Query로 캐싱하여 일관된 데이터 흐름 유지
  return {
    categoryLabels: AMENITY_CATEGORY_LABELS,
    amenitiesByCategory: AMENITIES_BY_CATEGORY,
  };
};

export function useAmenitiesQuery() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: fetchAmenities,
    staleTime: 1000 * 60 * 60, // 1h
  });
}
