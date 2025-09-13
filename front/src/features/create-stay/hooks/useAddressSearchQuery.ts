import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import type { AddressSearchResult } from '@/features/create-stay/types';

const getAddress = async (query: string, signal?: AbortSignal) => {
  try {
    // Next.js API Route를 직접 호출 (httpClient 우회)
    const response = await fetch(`/api/search-address?query=${encodeURIComponent(query)}`, {
      signal,
    });

    if (!response.ok) {
      throw new Error('주소 검색 중 오류가 발생했습니다.');
    }

    const data = await response.json();
    return data.body.filter((d: any) => !!d.zone_no);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // AbortError는 React Query에서 자동으로 처리하므로, 그대로 throw합니다.
      throw error;
    }
    // 다른 종류의 에러는 사용자에게 친화적인 메시지로 변환하여 throw합니다.
    throw new Error('주소 검색 중 오류가 발생했습니다.');
  }
};

export const useAddressSearchQuery = (keyword: string) => {
  const [debouncedKeyword] = useDebounce(keyword, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['addressSearch', debouncedKeyword],
    queryFn: ({ signal }) => getAddress(debouncedKeyword, signal),
    enabled: !!debouncedKeyword, // debouncedKeyword가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    addresses: data,
    isLoading,
    isError,
    error,
  };
};
