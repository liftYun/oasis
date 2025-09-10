import { useQuery } from '@tanstack/react-query';
import { http } from '@/apis/httpClient';
import type { AddressSearchResult } from '@/features/create-stay/types';

const getAddress = async (query: string) => {
  const data = await http.get<AddressSearchResult[]>(`/api/search-address?query=${query}`);
  return data;
};

export const useAddressSearchQuery = (keyword: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['addressSearch', keyword],
    queryFn: () => getAddress(keyword),
    enabled: !!keyword, // keyword가 비어있지 않을 때만 쿼리를 실행
  });

  return {
    addresses: data,
    isLoading,
    isError,
    error,
  };
};
