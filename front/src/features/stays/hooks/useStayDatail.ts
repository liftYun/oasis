'use client';

import { useQuery } from '@tanstack/react-query';
import { getStayDetail } from '@/services/stay.api';

export function useStayDetail(id: number) {
  return useQuery({
    queryKey: ['stay', id],
    queryFn: () => getStayDetail(id),
  });
}
